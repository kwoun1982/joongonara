var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlmin = require('gulp-htmlmin');
var copy = require('gulp-copy');
var gulp_remove_logging = require("gulp-remove-logging");

var destination = "dist";

gulp.task('minify', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(destination));
});

gulp.task('compress', function (cb) {
    pump([
            gulp.src('*.js'),
            gulp_remove_logging({
                namespace: ['console', 'window.console']
            }),
            uglify(),
            gulp.dest(destination)
        ],
        cb
    );
});

gulp.task('copyFunction', function (cb) {
    return gulp.src([
        'icon_16.png'
        ,'icon_38.png'
        ,'icon_48.png'
        ,'icon_128.png'
        , 'loading.gif'
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

