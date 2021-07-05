const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const tinypng = require('gulp-tinypng-compress');
const webpack = require('webpack');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revdel = require('gulp-rev-delete-original');
const htmlmin = require('gulp-htmlmin');

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts/';

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: ['node_modules'],
        outputStyle: 'expanded',
      }).on('error', notify.onError())
    )
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS(
        {
          level: 2,
          debug: true,
        },
        (details) => {
          console.log(`${details.name}: ${details.stats.originalSize} -> ${details.stats.minifiedSize} (${details.stats.timeSpent}ms) [${Math.round(details.stats.efficiency * 100)}%]`)
        }
      )
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream());
};

const htmlInclude = () => {
  return src(['./src/*.html', './src/html/*.html'])
    .pipe(
      fileInclude({
        prefix: '@',
        basepath: '@file',
      })
    )
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
};

const imgToApp = () => {
  return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg', './src/img/*.svg'])
    .pipe(dest('./app/img'))
}

const svgSprites = () => {
  return src('./src/img/svg/**.svg')
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(dest('./app/img'));
};

const resources = () => {
  return src('./src/resources/**.*').pipe(dest('./app'));
};

const fonts = () => {
  src('./src/fonts/**.ttf').pipe(ttf2woff()).pipe(dest('./app/fonts'));

  return src('./src/fonts/**.ttf').pipe(ttf2woff2()).pipe(dest('./app/fonts'));
};

const cb = () => { };

const fontsStyle = (done) => {
  let file_content = fs.readFileSync(srcFonts);

  fs.writeFile(srcFonts, '', cb);
  fs.readdir(appFonts, function (err, items) {
    if (items) {
      let c_fontname;
      for (var i = 0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname != fontname) {
          fs.appendFile(
            srcFonts,
            '@include font-face("' +
            fontname +
            '", "' +
            fontname +
            '", 400);\r\n',
            cb
          );
        }
        c_fontname = fontname;
      }
    }
  });

  done();
};

const clean = () => {
  return del(['app/*']);
};

const scripts = () => {
  return src('./src/js/main.js')
    .pipe(
      webpackStream({
        output: {
          filename: 'main.js',
        },
        mode: 'development',
        cache: {
          type: 'memory'
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
      },
        webpack)
    )
    .pipe(sourcemaps.init())
    //.pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './app'
    },
    notify: false,
    online: true
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/html/*.html', htmlInclude);
  watch('./src/*.html', htmlInclude);
  watch('./src/resources/**', resources);
  watch('./src/img/**.jpg', imgToApp);
  watch('./src/img/**.jpeg', imgToApp);
  watch('./src/img/**.png', imgToApp);
  watch('./src/img/*.svg', imgToApp);
  watch('./src/img/svg/**.svg', svgSprites);
  watch('./src/fonts/**', fonts);
  //watch('./src/fonts/**', fontsStyle);
};

const stylesBuild = () => {
  return src('./src/scss/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'expanded',
        includePaths: ['node_modules'],
      }).on('error', notify.onError())
    )
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS(
        {
          level: 2,
          debug: true,
        },
        (details) => {
          console.log(`${details.name}: ${details.stats.originalSize}`);
          console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }
      )
    )
    .pipe(dest('./app/css/'));
};

const scriptsBuild = () => {
  return src('./src/js/main.js')
    .pipe(
      webpackStream({
        output: {
          filename: 'main.js',
        },
        mode: 'production',
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
      },
        webpack)
    )
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('./app/js'));
};

const tinyImages = () => {
  return src('./src/img/**/*.{png,jpg,jpeg}')
    .pipe(
      tinypng({
        key: '8F9k0t9fmKyK884XRCw4Ns2dVDcw90yn',
        //sigFile: './src/img/.tinypng-sigs',
        log: true,
        summarize: true,
      })
    )
    .pipe(dest('./app/img'));
};

const cache = () => {
  return src('app/**/*.{css,js,svg,png,jpg,jpeg,woff2}', {
    base: 'app'
  })
    .pipe(rev())
    .pipe(revdel())
    .pipe(dest('app'))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest('app'));
};

const rewrite = () => {
  const manifest = src('app/rev.json');

  return src(['app/**/index.html', 'app/css/main.min.css'])
    .pipe(revRewrite({ manifest }))
    .pipe(dest('app'));
}

const htmlMinify = () => {
  return src('app/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('app'));
}

exports.styles = styles;
exports.watchFiles = watchFiles;

exports.default = series(
  clean,
  parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgSprites),
  // fontsStyle,
  styles,
  watchFiles
);

exports.build = series(
  clean,
  parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites),
  // fontsStyle,
  stylesBuild,
  //htmlMinify,
  tinyImages
);

exports.js = series(scriptsBuild);

exports.cache = series(cache, rewrite);

const revision = () => {
  return src('app/**/*.{css,js,jpg,png,svg,jpeg}')
    .pipe(rev())
    .pipe(src('app/**/*.html'))
    .pipe(revRewrite())
    //.pipe(revdel())
    .pipe(dest('app'));
}

exports.revision = series(revision);