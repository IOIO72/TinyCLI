'use strict';

// required modules
var gulp            = require('gulp'),
    babel           = require('gulp-babel'),
    autoprefixer    = require('autoprefixer'),
    sourcemaps      = require('gulp-sourcemaps'),
    concat          = require('gulp-concat'),
    postcss         = require('gulp-postcss'),
    precss          = require('precss'),
    ext_replace     = require('gulp-ext-replace'),
    jade            = require('gulp-jade'),
    html5lint       = require('gulp-html5-lint'),
    gulpCopy        = require('gulp-copy'),
    jshint          = require('gulp-jshint'),
    cleanDest       = require('gulp-clean-dest'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload;


// copy the jQuery bower package to the source directory.
gulp.task('copy:bower', function () {
    gulp.src([
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/showdown/dist/showdown.min.js'
        ])
        .pipe(gulpCopy('./source/js/vendor', {prefix: 3}))
    ;
});

// copy all javascripts from source to destination.
gulp.task('copy:js', function () {
    gulp.src([
            './source/js/vendor/**/*.js'
        ])
        .pipe(cleanDest('./build/js/vendor'))
        .pipe(gulpCopy('./build/js/vendor', {prefix: 3}))
    ;
});

// compile es2015 to js.
gulp.task('js:babel', function () {
    return gulp.src('./source/js/app/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/js'));
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
gulp.task('css', function () {
    var processors = [
        precss,
        autoprefixer({browsers: ['last 2 versions']})
    ];
    return gulp.src('./source/css/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(ext_replace('.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'));
});

// do these tasks to build the destination files.
gulp.task('build', [
        'copy:bower',
        'copy:js',
        'js:babel',
        'templates',
        'css'
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
            tasks: ['copy:js', 'js:babel']
        },
        {
            src: 'source/css/**/*.scss',
            tasks: ['css']
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
