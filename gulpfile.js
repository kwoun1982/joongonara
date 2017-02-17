var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlmin = require('gulp-htmlmin');
var copy = require('gulp-copy');
var destination = "dist";

gulp.task('minify', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(destination));
});

gulp.task('compress', function (cb) {
    pump([
            gulp.src('*.js'),
            uglify(),
            gulp.dest(destination)
        ],
        cb
    );
});

gulp.task('copyFunction', function (cb) {
    return gulp.src([
        'icon.png'
        , 'manifest.json'
    ]).pipe(copy(destination, {prefix: 1}));
});

gulp.task('copyVendor', function (cb) {
    return gulp.src([
        , 'vendor/**'
    ]).pipe(copy(destination + "/vendor", {prefix: 1}));
});

var clean = require('gulp-clean');
gulp.task('clean', function (cb) {
    return gulp.src('dist', {read: true})
        .pipe(clean());
});

gulp.task('default', ['compress', 'minify', 'copyFunction', 'copyVendor']);

