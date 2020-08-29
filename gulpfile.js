"use strict";

const gulp = require("gulp"),
    watchify = require("watchify"),
    browserify = require("browserify"),
    fs = require("fs");

// source = require("vinyl-source-stream"),
// buffer = require("vinyl-buffer"),
// sourcemaps = require("gulp-sourcemaps"),
// gulpBabel = require("gulp-babel"),
// babel = require("@babel/core"),
// bro = require("gulp-bro");

// gulp.task("default", () =>
//     browserify("src/components/FileSystemComponent.jsx", {
//         debug: true,
//         transform: [
//             babelify.configure({
//                 presets: ["@babel/preset-env", "@babel/preset-react"],
//                 plugins: ["transform-class-properties"],
//             }),
//         ],
//     })
//         .bundle()
//         .pipe(gulp.dest("./chrome_extension/components/comps"))
//

function build(cb) {
    // run.default("npm run build");
    browserify()
        .require("react")
        .require("react-dom")
        .add("./src/components/FileSystemComponent.jsx")
        .bundle()
        .pipe(fs.createWriteStream("chrome_extension/components/bundle.js"));
    cb();
}

function watch(cb) {
    // run.default("npm run build");
    browserify({ plugin: [watchify] })
        .require("react")
        .require("react-dom")
        .require("@material-ui/core/Accordian")
        .add("./src/components/FileSystemComponent.jsx")
        .bundle()
        .pipe(fs.createWriteStream("chrome_extension/components/bundle.js"));
    cb();
}

exports.default = build;
exports.watch = watch;
