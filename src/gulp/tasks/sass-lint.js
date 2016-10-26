"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
import config from "../config";
import utils from "../utils";

import sassLint from "gulp-sass-lint";
import size from "gulp-size";
//import debug from "gulp-debug";

// let browserSync = require("browser-sync").get(config.webServerNames.dev);

class SassLintTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        gulp.task("sass-lint", "Lint SASS Styles", () =>{
            let src = utils.getCssFolder(gulp, config);

            return gulp.plumbedSrc(// handle errors nicely (i.e., without breaking watch)
                src // only the application's code needs to be checked
                )

                // Display the files in the stream
                //.pipe(debug({title: "Stream contents:", minimal: true}))

                // Check the code quality
                .pipe(sassLint())
                .pipe(sassLint.format())
                .pipe(sassLint.failOnError())

                // Task result
                .pipe(size({
                    title: "sass-lint"
                }));
        });
    }
}

module.exports = new SassLintTaskLoader();
