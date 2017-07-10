const gulp =        require('gulp');
const uglify =      require('gulp-uglify');
const browserify =  require('browserify');
const babelify =    require('babelify');
const source =      require('vinyl-source-stream');
const buffer =      require('vinyl-buffer');
const replace =     require('gulp-replace');

const sourceJS = [
    // Global & Utilities
    'Scripts/Global.js',

    // Actions & Reducers
    'Scripts/Core/*.js',
    'Scripts/Common/*.js',
    'Scripts/Library/*.js',
    'Scripts/Builder/*.js',
    'Scripts/Designer/*.js',

    // Components
    'Scripts/**/*.jsx',
    '!Scripts/Tests/**/*.jsx',

    // Store
    'Scripts/store.js'
];

// BROWSERIFY
// ---------------------------------------------
// Primary bundling of components for distribution.
// This creates the single static JS file which applications
// request and load onto their page for global variables.
gulp.task('browserify-components', function () {
    return browserify({ entries: './Scripts/index.js' })
        .transform('babelify', { presets: [ 'es2015', 'react', 'stage-2' ]})
        .bundle()
        .pipe(source('scripts.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(replace(/('|")use strict\1(;*)/g, ''))
        .pipe(gulp.dest('Content'));
});

// LISTEN
// ---------------------------------------------
// Listen for changes of source files (saves).
gulp.task('watch', [], function () {
    // Rune main bundling browserify task on components.
    gulp.watch(sourceJS, ['browserify-components']);

});

gulp.task('default', [
    'browserify-components',
    'watch'
])