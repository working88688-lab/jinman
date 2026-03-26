import child_process from 'child_process'
import { deleteSync } from 'del'
import gulp from 'gulp'
import connect from 'gulp-connect'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import svgSprite from 'gulp-svg-sprite'

import proxy from 'http-proxy-middleware'

import { init_babel } from './tasks/babel.mjs'
import { init_scripts } from './tasks/scripts.mjs'
import { init_styles } from './tasks/styles.mjs'

import { check_port } from './build/utils.mjs'

import * as mock from './mock/index.mjs'

const is_prod = process.env.NODE_ENV === 'production'
const is_dev = process.env.NODE_ENV === 'development'
const assets_root = 'dist'
const public_path = '/static/frontend/'

const paths = {
  root: assets_root,
  styles: {
    src: ['src/css/**/*.css', '!src/css/module/**/*.css'],
    dest: `dist${public_path}css`
  },
  scripts: {
    src: 'src/js/lib/**/*.js',
    dest: assets_root + public_path + 'js/lib'
  },
  pug: {
    src: 'src/**/*.pug',
    dest: 'dist/'
  },
  tpl: {
    src: 'src/template/**/*'
  },
  images: {
    src: 'src/images/**/*',
    dest: assets_root + public_path + 'images'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: assets_root + public_path + 'fonts'
  },
  svg: {
    src: 'src/icons/**/*.svg',
    dest: assets_root + public_path
  },
  babel: {
    src: ['src/js/**/*.js', '!src/js/lib/**/*.js'],
    dest: assets_root + public_path + 'js'
  },
  html: {
    src: 'src/**/*.html',
    dest: assets_root
  }
}

const host = {
  port: 9527,
  proxy: ''
}

export const clean = cb => {
  deleteSync([paths.root])
  cb()
}

const scripts = init_scripts({ config: paths.scripts, connect, env: { is_dev, is_prod } })
const styles = init_styles({ config: paths.styles, connect, env: { is_dev, is_prod } })
const babels = init_babel(paths.babel, connect)

function pug_task() {
  return gulp
    .src(paths.pug.src)
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
        data: {
          ...mock
        }
      })
    )
    .pipe(gulp.dest(paths.root))
    .pipe(connect.reload())
}

function buildSvg() {
  return gulp
    .src(paths.svg.src)
    .pipe(plumber())
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: '',
            sprite: 'icons/icons.svg'
          }
        }
      })
    )
    .pipe(gulp.dest(paths.svg.dest))
}

function images() {
  return gulp.src(paths.images.src, { encoding: false }).pipe(plumber()).pipe(gulp.dest(paths.images.dest))
}

function fonts() {
  return gulp.src(paths.fonts.src, { encoding: false }).pipe(plumber()).pipe(gulp.dest(paths.fonts.dest))
}

function html() {
  return gulp.src(paths.html.src, { encoding: false }).pipe(plumber()).pipe(gulp.dest(paths.html.dest))
}

function serve() {
  return new Promise(resolve => {
    check_port(host.port).then(_port => {
      host.port = _port
      connect.server({
        root: paths.root,
        port: host.port,
        livereload: true,
        host: '::',
        middleware: function () {
          return [
            proxy.createProxyMiddleware({
              target: 'https://jmtt-web-test.yesebo.net',
              changeOrigin: true,
              pathRewrite: { '^/_api': '' },
              pathFilter: '/_api/**'
            })
          ]
        }
      })

      resolve()
    })
  })
}

function openBrowser(cb) {
  child_process.exec(`open http://localhost:${host.port}`)

  cb()
}

// function mocks() {
//   return gulp
//     .src('./src/mock/**/*.json')
//     .pipe(plumber())
//     .pipe(gulp.dest('dist' + public_path))
// }

function watch(cb) {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, images)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.svg.src, buildSvg)
  gulp.watch(paths.babel.src, babels)
  gulp.watch('./tailwind.config.js', styles)
  // gulp.watch('./src/mock/**/*.json', mocks)
  gulp.watch('./mocks/**/*.mjs', pug_task)

  gulp.watch(paths.pug.src, gulp.series(styles, pug_task)).on('change', connect.reload)

  cb()
}

const dev = gulp.series(
  clean,
  gulp.parallel(pug_task, styles, scripts, buildSvg, fonts, html, images, babels),
  serve,
  gulp.parallel(openBrowser, watch)
)

export const build = gulp.series(clean, gulp.parallel(pug_task, styles, scripts, buildSvg, fonts, html, images, babels))

export default dev
