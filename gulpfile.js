const {
    src,
    dest,
    watch,
    series,
    parallel,
  } = require("gulp");
  
  const autoprefixer = require("autoprefixer");
  const cssnano = require("cssnano");
  const concat = require("gulp-concat");
  const postcss = require("gulp-postcss");
  const replace = require("gulp-replace");
  const sass = require("gulp-sass")(require("sass"));
  const sourcemaps = require("gulp-sourcemaps");
  const uglify = require("gulp-uglify");
  const webserver = require("gulp-webserver");
  
  // File path variables
  const files = {
    scssPath: "app/sass/**/*.scss",
    jsPath: "app/js/**/*.js",
    htmlPath: "app/**/*.html",
    resources: "app/res/**"
  };
  
  /** Tasks */
  // * sass
  const scssTask = () =>
    src(files.scssPath)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sourcemaps.write("."))
      .pipe(dest("dist"));
  
  // * js
  const jsTask = () =>
    src(files.jsPath).pipe(uglify()).pipe(dest("dist"));
  
  // * cache busting
  const cacheBustTask = () => {
    const cbString = new Date().getTime();
    console.log("cbString = ", cbString);
    return src(files.htmlPath)
      .pipe(replace(/cb=\d+/g, "cb=" + cbString))
      .pipe(dest("dist"));
  }
  
  // * html
  const htmlTask = () =>
    src(files.htmlPath).pipe(dest("dist"));

  const resTask = () => 
    src(files.resources).pipe(dest("dist"));
  
  // * watch
  const watchTask = () =>
    watch(
      [files.scssPath, files.jsPath, files.htmlPath],
      series(parallel(scssTask, jsTask), htmlTask)
    );
  
  const serveTask = () =>
    src("dist").pipe(
      webserver({
        livereload: true,
        open: true,
      })
    );

  const build = series(
    parallel(scssTask, jsTask),
    htmlTask,
    cacheBustTask,
    resTask,
  );
  
  // * default
  exports.default = series(
    parallel(scssTask, jsTask),
    htmlTask,
    cacheBustTask,
    resTask,
    serveTask,
    watchTask
  );

  exports.build = build;
  