const gulp =        require('gulp');
const concat =      require('gulp-concat');		// Merge files.
const babel =       require('gulp-babel');		// Transpile from ES6 to ES5.
const plumber =     require('gulp-plumber');

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

const sourceJSTests = [
    'Scripts/Tests/Components/*.jsx',
    'Scripts/Tests/**/*.jsx'
];

const babelOptions = {
    presets: [
        'es2015',
        'react',
        'stage-2'
    ]
};

gulp.task('build', function () {
    return gulp.src(sourceJS)
        .pipe(plumber())
	    .pipe(concat('scripts.js'))
	    .pipe(babel(babelOptions))
	    .pipe(gulp.dest('Content'));
});

gulp.task('build-tests', function () {
    return gulp.src(sourceJSTests)
        .pipe(plumber())
	    .pipe(concat('tests.js'))
	    .pipe(babel(babelOptions))
	    .pipe(gulp.dest('Content'));
});

gulp.task('watch', ['build', 'build-tests'], function () {
    gulp.watch(sourceJS, ['build']);
    gulp.watch(sourceJSTests, ['build-tests']);
});

gulp.task('default', ['watch']);