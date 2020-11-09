//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

const cssFiles = [
   './node_modules/normalize.css/normalize.css',
   './src/sass/main.sass'
]
const jsFiles = [
   './node_modules/jquery/dist/jquery.min.js',
   './src/js/base.js',
   './src/js/plugins/modal.js',
   './src/js/main.js'
]
function styles() {
   return gulp.src(cssFiles)
   .pipe(sourcemaps.init())
   .pipe(sass())
   .pipe(concat('style.css'))
   .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
   }))
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write('./'))
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
}

function scripts() {
   return gulp.src(jsFiles)
  .pipe(concat('script.js'))
  // .pipe(uglify({
  //    toplevel: true
  // }))
  .pipe(gulp.dest('./build/js'))
  .pipe(browserSync.stream());
}


function clean() {
   return del(['build/*'])
}

function watch() {
   browserSync.init({
      server: {
          baseDir: "./"
      },
      port: process.env.PORT || 5000  });

  gulp.watch('./src/sass/**/*.sass', styles)
  gulp.watch('./src/js/**/*.js', scripts)
  gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
gulp.task('dev', gulp.series('build','watch'));
gulp.task('heroku:dev', gulp.series('build','watch'));
