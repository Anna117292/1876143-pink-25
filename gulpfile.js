import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
//import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
//import svgstore from 'gulp-svgstore';
import del from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML

/*
  export const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'));
}
*/

//script
/*
export const scripts = () => {
  return gulp.src('source/js/script.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
  }
*/

//image

export const optimizeImages = () => {
  return gulp.src('source/img/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

export const copyImages = () => {
  return gulp.src('source/img/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}


//webp

export const createWebp = () => {
  return gulp.src('source/img/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
}


//svg

export const svg = () => {
  return gulp.src('source/img/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}


//copy

export const copy = (done) => {
  return gulp.src(['source/fonts/*.{woff2,woff}',
  'source/*.ico',
], {
  base: 'source'
})
  .pipe(gulp.dest('build'))
}


//clean

export const clean = () => {
  return del('build');
};


// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// reload

const reload = (done) => {
 browser.reload();
 done();
}



// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
 // gulp.watch('source/js/script.js', gulp.series(scripts));
  //gulp.watch('source/*.html').on('change', browser.reload);
}

//build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    createWebp,
    svg
  ),
);

// defolt
export const defolt = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    createWebp,
  ),
  gulp.series(
    server,
    watcher
  ));



/*export default gulp.series(
  html, styles, server, watcher
);*/
