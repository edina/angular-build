"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
import config from "../config";
//import utils from "../utils";

import jscs from "gulp-jscs";
import jscsStylish from "gulp-jscs-stylish";
import size from "gulp-size";
//import debug from "gulp-debug";

class CheckJsStyleTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        gulp.task("check-js-style", "Enforce JavaScript code style", () =>{
            // If the app src folder is overridden, then append it to the watch list, otherwise use default.
            let src = null;

            if(gulp.options.folders.app){
                src = [ gulp.options.folders.app + config.globs.scripts.javascript ];
            } else{
                src = config.javascript.src;
            }

            return gulp.plumbedSrc(// handle errors nicely (i.e., without breaking watch)
                src
                )

                // Display the files in the stream
                //.pipe(debug({title: "Stream contents:", minimal: true}))

                // Check JS code style (uses .jscsrc)
                .pipe(
                    jscs({
                        esnext: true, // seems broken: https://github.com/jscs-dev/gulp-jscs/issues/69
                        fix: false
                    })
                )

                .pipe(jscsStylish()) // log style errors

                // Task result
                .pipe(size({
                    title: "check-js-style"
                }));
        });
    }
}

module.exports = new CheckJsStyleTaskLoader();

