var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();
var allScssFiles    = './scss/**/*.scss';

gulp.task('babel', () => {
    return gulp.src('app/app.js')
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('assets/js'));
});

gulp.task('sass', function () {
    gulp.src('./scss/styles.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.autoprefixer('last 3 version'))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('watch', function () {
    gulp.watch('app/app.js', ['babel']);
    gulp.watch(allScssFiles, ['sass']);
});

gulp.task('default', ['sass', 'babel', 'watch']);