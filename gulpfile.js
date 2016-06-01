'use strict';

let gulp = require('gulp');
let runSequence = require('run-sequence');
let browserify = require('browserify');
let source = require('vinyl-source-stream');

// default
gulp.task('default', ['build']);

// build
gulp.task('build', () => {
    runSequence(['browserify']);
});

// browserify
gulp.task('browserify', () => {
    browserify({
        entries: ['./app/main.js'],
        require: ['jquery', 'underscore','backbone', 'backbone.validation']
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./app/'));
});
