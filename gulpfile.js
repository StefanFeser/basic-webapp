var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();
var wiredep         = require('wiredep').stream;
var allScssFiles    = './scss/**/*.scss';

/*
 * Compiling/Transpiling ES20XX to Javascript
 */
gulp.task('babel', () => {
    return gulp.src('app/app.js')
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('assets/js'));
});

/*
 * Compiling SASS to CSS
 */
gulp.task('sass', function () {
    gulp.src('./scss/styles.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.autoprefixer('last 3 version'))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css'));
});

/*
 * Automatically inject all javascript files in assets/js
 * into index.html
 */
gulp.task('injectJS', function () {
    var target = gulp.src('./index.html'); 
    var sources = gulp.src(['./assets/js/**/*.js'], {read: false});

    return target.pipe(plugins.inject(sources))
    .pipe(gulp.dest('./'));
});

/*
 * Inject all bower JS dependencies into index.html
 */
gulp.task('bower-install', function () {
    gulp.src('./index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('./'));
});

/*
 * Watch js & sass changes
 */
gulp.task('watch', function () {
    gulp.watch('app/app.js', ['babel']);
    gulp.watch(allScssFiles, ['sass']);
});

gulp.task('default', [
    'injectJS', 
    'sass', 
    'babel', 
    'watch'
]);
