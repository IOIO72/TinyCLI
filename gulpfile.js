'use strict';

// required modules
var gulp = require('gulp'),
    jade = require('gulp-jade'),
    html5lint = require('gulp-html5-lint'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    csslint = require('gulp-csslint'),
    gulpCopy = require('gulp-copy'),
    jshint = require('gulp-jshint'),
    cleanDest = require('gulp-clean-dest'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// copy the jQuery bower package to the source directory.
gulp.task('copy:bower', function () {
    gulp.src([
        './bower_components/jquery/dist/jquery.min.js'
    ])
        .pipe(gulpCopy('./source/js/vendor', {prefix: 3}))
    ;
});

// copy all javascripts from source to destination.
gulp.task('copy:js', function () {
    gulp.src([
        './source/js/**/*.js'
    ])
        .pipe(cleanDest('./build/js'))
        .pipe(gulpCopy('./build/js', {prefix: 2}))
    ;
});

// check JavaScript while building.
gulp.task('lint', function () {
    return gulp.src('./source/js/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        ;
});

// build HTML files and check them.
gulp.task('templates', function () {
    gulp.src('./source/jade/*.jade')
        .pipe(cleanDest('./build'))
        .pipe(jade({pretty: true}))
        .pipe(html5lint())
        .pipe(gulp.dest('./build'))
    ;
});

// build and check CSS files and add source maps to them.
gulp.task('sass', function () {
    gulp.src('./source/sass/**/*.scss')
        .pipe(cleanDest('./build/css'))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['Chrome > 45', 'Firefox > 37', 'Safari > 8', 'Opera > 31'], // browser versions to support
            cascade: false,
            add: true
        }))
        .pipe(csslint())
        .pipe(csslint.reporter('text'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'))
    ;
});

// do these tasks to build the destination files.
gulp.task('build', [
        'copy:bower',
        'copy:js',
        'templates',
        'sass'
    ]
);

// watch task function for serving or just building
var _watcher = function (blnReload) {
    var arrWatcher = [
        {
            src: 'source/jade/**/*.jade',
            tasks: ['templates']
        },
        {
            src: 'source/js/**/*.js',
            tasks: ['copy:js', 'lint']
        },
        {
            src: 'source/sass/**/*.{scss,sass}',
            tasks: ['sass']
        }
    ];
    var _arrTasks = null;
    for (var i = 0; i < arrWatcher.length; i++) {
        _arrTasks = arrWatcher[i].tasks;
        if (blnReload) _arrTasks.push(reload);
        gulp.watch(arrWatcher[i].src, _arrTasks);
    }
};

// watch the source files to build destination immediately.
gulp.task('watch', ['build'], function () {
    _watcher(false);
});

// watch the source files to build and show destination immediately.
gulp.task('serve', ['build'], function () {
    browserSync({
        notify: false,
        server: {
            baseDir: ['build'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });
    _watcher(true);
});

// definied default task. (You could change 'watch' to the task 'serve').
gulp.task('default', ['watch']);

// definied test task.
gulp.task('test', ['build']);
