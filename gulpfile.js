'use strict';

let gulp = require('gulp');
let runSequence = require('run-sequence');
let browserify = require('browserify');
let source = require('vinyl-source-stream');

// default
gulp.task('default', ['build']);

// build
gulp.task('build', () => {
    runSequence(['browserify', 'html']);
});

// browserify
gulp.task('browserify', () => {
    browserify({
        entries: ['./app/main.js'],
        require: ['jquery', 'underscore','backbone', 'backbone.validation']
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('../public/js/'));
});

// copy html
gulp.task('html', () => {
    gulp.src('index.html')
        .pipe(gulp.dest('../src/main/resources/templates/'));
});
