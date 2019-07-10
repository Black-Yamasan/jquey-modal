const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const ejs = require('gulp-ejs');
const ugilify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const minimist = require('minimist');
const del = require('del');
const browserSync = require('browser-sync').create();
const runSequence = require('gulp4-run-sequence');
const destDir = './dist/';
const prodDir = './htdocs/';
const config = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'dev' }
};
const options = minimist(process.argv.slice(2), config);
let isProd = (options.env === 'prod') ? true : false;
console.log('[build env]', options.env, '[isProd]', isProd);

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: destDir
    }
  });
});

gulp.task('sass', () => {
  return gulp.src(['src/resources/**/*.scss'])
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(rename((path) => {
    path.dirname = 'css'
  }))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 2 version', 'iOS >= 10', 'Android >= 5'],
    cascade: false
  }))
  .pipe(gulpif(isProd, cleanCss()))
  .pipe(gulpif(!isProd, gulp.dest(destDir)))
  .pipe(gulpif(isProd, gulp.dest(prodDir)))
});

gulp.task('ejs', () => {
  return gulp.src(['src/resources/templates/pages/**/*.ejs', '!src/sresources/templates/**/*_.ejs'])
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(ejs())
  .pipe(rename({ extname: '.html' }))
  .pipe(gulpif(!isProd, gulp.dest(destDir)))
  .pipe(gulpif(isProd, gulp.dest(prodDir)))
});

gulp.task('js', () => {
  return gulp.src(['src/resources/scripts/**/*.js'])
  .pipe(gulpif(isProd, ugilify({
    output: {
      comments: /^\/* /
    }
  })))
  .pipe(gulpif(!isProd, gulp.dest(destDir + 'js/')))
  .pipe(gulpif(isProd, gulp.dest(prodDir + 'js/')))
});

gulp.task('images', () => {
  return gulp.src(['src/resources/images/**/*'])
  .pipe(gulpif(!isProd, gulp.dest(destDir + 'images/')))
  .pipe(gulpif(isProd, gulp.dest(prodDir + 'images/')))
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('clean', del.bind(null, prodDir));

gulp.task('build', gulp.series(
  gulp.parallel('sass', 'ejs', 'js', 'images')
));

gulp.task('default', gulp.series(
  gulp.parallel('browser-sync', 'sass', 'ejs', 'js', 'images', () => {
    watch(['src/**/*.scss'], () => {
      return runSequence(
        'sass', 
        'bs-reload'
      );
    });
    watch(['src/**/*.js'], () => {
      return runSequence(
        'js',
        'bs-reload'
      );
    });
    watch(['src/**/*.ejs'], () => {
      return runSequence(
        'ejs',
        'bs-reload'
      );
    });
    watch(['src/resources/images/**/*'], () => {
      return runSequence(
        'images',
        'bs-reload'
      );
    });
  })
));
