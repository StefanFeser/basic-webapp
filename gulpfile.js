var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();
var allScssFiles    = 'scss/**/*.scss';
var pngquant        = require('imagemin-pngquant');
var del             = require('del');

var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var browserify      = require('browserify');
var watchify        = require('watchify');
var babel           = require('babelify');


/*
 * Using browserify + babelify to bundle all JS files
 */
function compileModules() {
    var bundler = browserify('./app/app.js', { debug: true }).transform(babel);

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(plugins.sourcemaps.init({ loadMaps: true }))
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest('./assets/js/build'));
    }

    rebundle();
}

gulp.task('browserify', function() { 
    return compileModules(); 
});

/*
 * Lint JS/ES6 Files
 */
gulp.task('lint', () => {
    return gulp.src(['app/**/*.js','!node_modules/**'])
        .pipe(plugins.eslint({
            rules: {
                'strict': 2,
            },
            parserOptions: {
                "sourceType": "module"
            },
            globals: [
                'jQuery',
                '$'
            ],
            envs: [
                'browser'
            ]
        }))
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError())
        .on("error", plugins.notify.onError('ES Lint error!'));
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
 * Watch js & sass changes
 */
gulp.task('watch', function () {
    gulp.watch('app/**/*.js', ['lint', 'browserify']);
    gulp.watch(allScssFiles, ['sass']);
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
    'sass',
    'lint',
    'browserify',
    'watch'
]);

gulp.task('build', [
    'clean', 
    'sass',
    'lint',
    'browserify',
    'parker', 
    'imagemin',
    'usemin'
]);
