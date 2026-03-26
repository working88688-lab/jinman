// import autoprefixer from "autoprefixer";
// import cssnano from "cssnano";
// import purgecss from '@fullhuman/postcss-purgecss';
import gulp from 'gulp'
import cssnano from 'gulp-cssnano'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'

export function init_styles({ config, connect, env = {} } = {}) {
  return env.is_dev
    ? function styles() {
        return gulp.src(config.src).pipe(plumber()).pipe(postcss()).pipe(gulp.dest(config.dest)).pipe(connect.reload())
      }
    : function styles() {
        return gulp.src(config.src).pipe(plumber()).pipe(postcss()).pipe(cssnano()).pipe(gulp.dest(config.dest))
      }
}
