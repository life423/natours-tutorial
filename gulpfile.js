import { src, dest, watch, series } from 'gulp'
import gulpSass from 'gulp-sass'
import * as sass from 'sass'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'
import postcssPresetEnv from 'postcss-preset-env'

// Initialize SASS compiler
const sassCompiler = gulpSass(sass)

// Define paths
const paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/css',
    },
    scripts: {
        src: 'src/js/**/*.js', // Watch all JS files in src/js and its subdirectories
    },
}



// Compile SASS to CSS
// function compileSass() {
//     return src(paths.styles.src)
//         .pipe(sourcemaps.init())
//         .pipe(sassCompiler().on('error', sassCompiler.logError))
//         .pipe(postcss([autoprefixer(), cssnano()]))
//         .pipe(sourcemaps.write('.'))
//         .pipe(dest(paths.styles.dest))
//         .pipe(browserSync.stream())
// }

function compileSass() {
    return src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(
            postcss([
                postcssPresetEnv({
                    stage: 3, // Adjust based on desired CSS features
                    browsers: 'last 2 versions',
                }),
                cssnano(),
            ])
        )
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

// Live-reloading server
// function liveReload() {
//     browserSync.init({
//         server: {
//             baseDir: './',
//         },
//     })

//     watch(paths.styles.src, compileSass)
//     watch('*.html').on('change', browserSync.reload)
// }

// Live-reloading server
function liveReload() {
    browserSync.init({
        server: {
            baseDir: './',
        },
    })

    watch(paths.styles.src, compileSass) // Watch SASS files
    watch('*.html').on('change', browserSync.reload) // Watch root HTML files
    watch(paths.scripts.src).on('change', browserSync.reload) // Watch JS files
}

// Default Gulp task
export default series(compileSass, liveReload)
