import gulp from 'gulp'
import babel from 'gulp-babel'
import plumber from 'gulp-plumber'
import buffer from 'vinyl-buffer'

export function init_babel(config, connect) {
  return function scripts() {
    return gulp
      .src(config.src)
      .pipe(plumber())
      .pipe(buffer())
      .pipe(
        babel({
          presets: ['@babel/preset-env'],
          targets: {
            chrome: '58',
            firefox: '60',
            edge: '16',
            safari: '11.1'
          }
        })
      )
      .pipe(gulp.dest(config.dest))
      .pipe(connect.reload())
  }
}
