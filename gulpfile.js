const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pump = require('pump');
const babel = require('gulp-babel');

gulp.task('sass', () => {
    return gulp.src('./sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', cb => {
    pump([
            gulp.src('./js/*.js'),
            babel({
                presets: ['env']
            }),
            uglify(),
            gulp.dest('./public/js')
        ],
        cb
    );
});

gulp.task('default', ['sass', 'js'], () => {
    gulp.watch('./sass/**/*.sass', ['sass']);
    gulp.watch('./js/**/*.js', ['js']);
});