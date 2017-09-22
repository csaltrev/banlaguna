const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

gulp.task('sass', () => {
    return gulp.src('./sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', () => {
    return gulp.src('./js/user.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('default', ['sass', 'js'], () => {
    gulp.watch('./sass/**/*.sass', ['sass']);
    gulp.watch('./js/**/*.js', ['js']);
});