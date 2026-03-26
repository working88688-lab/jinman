import gulp from 'gulp'
import plumber from 'gulp-plumber'
import uglify from 'gulp-uglify'
import buffer from 'vinyl-buffer'

export function init_scripts({ config, connect, env = {} } = {}) {
  return env.is_dev
    ? function scripts() {
        return gulp.src(config.src).pipe(plumber()).pipe(buffer()).pipe(gulp.dest(config.dest)).pipe(connect.reload())
      }
    : function scripts() {
        return gulp.src(config.src).pipe(plumber()).pipe(buffer()).pipe(uglify()).pipe(gulp.dest(config.dest))
      }
}
