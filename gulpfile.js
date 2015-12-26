var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();
var wiredep         = require('wiredep').stream;
var allScssFiles    = './scss/**/*.scss';
var pngquant        = require('imagemin-pngquant');
var del             = require('del');

/*
 * Compiling/Transpiling ES20XX to Javascript
 */
gulp.task('babel', () => {
    return gulp.src('app/**/*.js')
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
    gulp.watch('app/**/*.js', ['babel']);
    gulp.watch(allScssFiles, ['sass']);
    gulp.watch('assets/js/**/*.js', ['injectJS']);
});

/*
 * BUILD DISTRIBUTION DIRECTORY
 * - clean dist folder
 * - concat & minify all JS files
 * - minify CSS files
 * - optimize images
 * - generate css report
 */
gulp.task('usemin', function() {
  return gulp.src('./index.html')
    .pipe(plugins.usemin({
        css: [ plugins.cssnano(), plugins.rev() ],
        html: [ plugins.htmlmin({ empty: true }) ],
        js: [ plugins.uglify(), plugins.rev() ]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', () => {
    return gulp.src('assets/images/**/*')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('clean', function () {
    del.sync([
        'dist/**/*',
        '!dist/crossdomain.xml',
        '!dist/humans.txt',
        '!dist/robots.txt',
    ]);
});

gulp.task('parker', function() {
    return gulp.src('assets/css/styles.css')
        .pipe(plugins.parker({
            file: 'css-report.md',
            title: 'CSS Report'
        }));
});

/*
 * TASKS TO INVOKE
 */
gulp.task('default', [
    'injectJS', 
    'sass', 
    'babel', 
    'watch'
]);

gulp.task('build', [
    'clean',
    'injectJS', 
    'sass', 
    'babel',
    'parker', 
    'imagemin',
    'usemin'
]);
