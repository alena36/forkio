// common
const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
// images
const image = require('gulp-image');
// styles
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// js
const uglify = require('gulp-uglify');

// settings
const src = 'src';
const dest = 'dest';
const build = 'build';
const paths = {
    src: {
        scss: `${src}/scss/**/*`,
        html: `${src}/**/*.html`,
        img: `${src}/images/**/*`,
        js: `${src}/js/**/*`,
    },
    dest: {
        css: `${dest}/css`,
        img: `${dest}/images`,
        js: `${dest}/js`,
    },
    build: {
        css: `${build}/css`,
        img: `${build}/images`,
        js: `${build}/js`,
    }
};
const browsers = ['last 2 versions', '> 1%', 'not dead'];
const imageOptimization = {
    pngquant: true,
    optipng: true,
    zopflipng: false,
    jpegRecompress: false,
    jpegoptim: true,
    mozjpeg: true,
    gifsicle: true,
    svgo: true,
    concurrent: 10
};

// handlers

// Doesn't break the watcher, just shows an error in console.
function onErrorHandler (error) {
    console.log(error);
    this.emit('end');
}

//tasks
gulp.task('scss', function () {
    return gulp.src(paths.src.scss)
        .pipe(plumber({ errorHandler: onErrorHandler }))
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest.css))
        .pipe(plumber.stop())
        .pipe(browserSync.stream());
});

gulp.task('scss--build', function () {
    return gulp.src(paths.src.scss)
        .pipe(plumber({ errorHandler: onErrorHandler }))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({ browsers: browsers }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.build.css))
        .pipe(plumber.stop());
});

gulp.task('html', function () {
    return gulp.src(paths.src.html)
        .pipe(plumber({ errorHandler: onErrorHandler }))
        .pipe(gulp.dest(dest))
        .pipe(plumber.stop())
        .pipe(browserSync.stream());
});

gulp.task('html--build',function () {
    return gulp.src(paths.src.html)
        .pipe(gulp.dest(build));
});

gulp.task('images', function () {
    return gulp.src(paths.src.img)
        .pipe(plumber({ errorHandler: onErrorHandler }))
        .pipe(gulp.dest(paths.dest.img))
        .pipe(plumber.stop())
        .pipe(browserSync.stream());
});

gulp.task('images--build', function () {
    return gulp.src(paths.src.img)
        .pipe(plumber({ errorHandler: onErrorHandler }))
        .pipe(image(imageOptimization))
        .pipe(gulp.dest(paths.build.img))
        .pipe(plumber.stop());
});

gulp.task('js', function () {
    return gulp.src(paths.src.img)
        .pipe(plumber({ errorHandler: onErrorHandler }))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(plumber.stop())
        .pipe(browserSync.stream());
});

gulp.task('js--build', function () {
    return gulp.src(paths.src.js)
        .pipe(plumber({ errorHandler: onErrorHandler }))
        .pipe(uglify())
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.js))
        .pipe(plumber.stop());
});

gulp.task('clean', function () {
    del.sync([
        `${dest}/**`,
        `!$!dest}`,
        `${build}/**`,
        `!${build}`,
    ]);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: dest
        },
        notify: false
    });
    gulp.watch(paths.src.scss, ['scss']);
    gulp.watch([paths.src.html], ['html']);
    gulp.watch([paths.src.img], ['images']);
    gulp.watch([paths.src.js], ['js']);
});

gulp.task('compile', ['clean', 'scss', 'html', 'images', 'js']);
gulp.task('build', ['clean', 'scss--build', 'html--build', 'images--build', 'js--build']);
gulp.task('default', ['clean', 'compile', 'browser-sync']);