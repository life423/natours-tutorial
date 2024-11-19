import { src, dest, watch, series } from 'gulp'
import gulpSass from 'gulp-sass'
import * as sass from 'sass'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'

// Initialize SASS compiler
const sassCompiler = gulpSass(sass)

// Define paths
const paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/css',
    },
}

// Compile SASS to CSS
function compileSass() {
    return src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

// Live-reloading server
function liveReload() {
    browserSync.init({
        server: {
            baseDir: './',
        },
    })

    watch(paths.styles.src, compileSass)
    watch('*.html').on('change', browserSync.reload)
}

// Default Gulp task
export default series(compileSass, liveReload)
