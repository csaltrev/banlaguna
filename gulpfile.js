const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
 
gulp.task('sass', () => {
  return gulp.src('./sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('default', ['sass'], () => {
    gulp.watch('./sass/**/*.sass', ['sass']);
});