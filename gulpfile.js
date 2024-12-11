// gulpfile.js

import { src, dest, watch, series, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import stylelint from 'gulp-stylelint';

// Initialize SASS compiler
const sassCompiler = gulpSass(sass);

// Define paths
const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css',
  },
  scripts: {
    src: 'src/js/**/*.js', // Watch all JS files in src/js and its subdirectories
  },
};

// Stylelint Task
function lintStyles() {
  return src(paths.styles.src)
    .pipe(stylelint({
      failAfterError: false, // Continue on error
      reporters: [
        { formatter: 'string', console: true },
      ],
    }));
}

// Compile SASS to CSS with PostCSS plugins
function compileSass() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(postcss([
      autoprefixer(),
      postcssPresetEnv({
        stage: 3, // Enables modern CSS features
        browsers: 'last 2 versions', // Aligns with Browserslist
      }),
      cssnano() // Minifies the CSS
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Live-reloading server
function liveReload() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });

  watch(paths.styles.src, series(lintStyles, compileSass)); // Watch SASS files
  watch('*.html').on('change', browserSync.reload); // Watch root HTML files
  watch(paths.scripts.src).on('change', browserSync.reload); // Watch JS files
}

// Default Gulp task
export default series(parallel(lintStyles, compileSass), liveReload)