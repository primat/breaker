const gulp = require('gulp');
const connect = require('gulp-connect');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('connect', function() {
    connect.server({
        root: ['demo', 'dist'],
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('./demo/*.html')
        .pipe(gulp.dest('./demo'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('./demo/*.js')
        .pipe(gulp.dest('./demo'))
        .pipe(connect.reload());
});

gulp.task('app-js', function () {
    return gulp.src('./src/**/*.js')
        .pipe(concat('breaker.js'))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('app-js:min', function () {
    return gulp.src('./src/**/*.js')
        .pipe(uglify())
        .pipe(concat('breaker.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./demo/*.html'], ['html']);
    gulp.watch(['./demo/*.js'], ['js']);
    gulp.watch(['./src/**/*.js'], ['app-js', 'app-js:min']);
});


gulp.task('angular', function () {
    gulp.src('./node_modules/angular/angular.min.js')
        .pipe(gulp.dest('./demo'));
});

gulp.task('default', ['build', 'connect', 'watch']);

gulp.task('build', ['app-js', 'app-js:min']);
