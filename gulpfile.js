'use strict'

const gulp = require('gulp'); // +
const sass = require('gulp-sass'); // +
const del = require('del');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const sourcemap = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const combiner = require('stream-combiner2').obj;
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const myth =require('gulp-myth'); //autoprefix

gulp.task('default', function () { console.log('Hello Gulp!') });

gulp.task('styles', function(){
    return gulp.src('frontend/styles/index.scss')
        .pipe(gulpIf(!isDevelopment, sourcemap.init()))
        .pipe(sass())
        .on('error', notify.onError(function(err) {
            return {
                title: "Style Eror",
                message: err.message
            };
        }))
        .pipe(gulpIf(!isDevelopment, sourcemap.write()))
        .pipe(gulpIf(!isDevelopment, combiner(cssnano(), rev())))
        .pipe(gulp.dest('public/styles'))
        .pipe(gulpIf(!isDevelopment, combiner(rev.manifest('css.json'), gulp.dest('manifest'))));
});


gulp.task('assets', function(){
    return gulp.src('frontend/assets/**/*.*', {since: gulp.lastRun('assets')})
        .pipe( gulpIf(!isDevelopment,
            revReplacer({
                manifest: gulp.src('manifest/css.json',
                    {allowEmpty:true})
            })))
        .pipe(gulp.dest('public'));
});

gulp.task('styles:assets', function(){
    return gulp.src('frontend/styles/**/*.{png,jpg}', {since: gulp.lastRun('styles:assets')})
        .pipe(gulp.dest('public/styles'));
});



gulp.task('clean', function(){
    return del('public');
});

gulp.task('build',gulp.series('clean', gulp.series('styles:assets','styles', 'assets')));


gulp.task('watch',function() {

});

gulp.task('serve', function(){
    browserSync.init({
        server:'public'
    });
    browserSync.watch('public/**/*.*').on('change', gulp.series(browserSync.reload));
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
