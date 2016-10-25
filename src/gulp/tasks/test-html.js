"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
import config from "../config";
import utils from "../utils";

import eventStream from "event-stream";
import size from "gulp-size";
// import debug from "gulp-debug";

class CopyTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        gulp.task("test-html-copy", "Copy all HTML templatefiles for unit tests", () =>{
            // If the app src folder is overridden, then append it to the watch list, otherwise use default.
            let src = null;

            if(gulp.options.folders){
                src = [
                    gulp.options.folders.app + config.globs.html
                ];
            } else{
                src = config.folders.app + config.globs.html;
            }

            return gulp.plumbedSrc(
                src, {
                    dot: true
                })

                // Display the files in the stream
                //.pipe(debug({title: "Stream contents:", minimal: true}))

                // Display the files in the stream
                // .pipe(debug({title: "Stream contents:", minimal: true}))

                // Copy
                .pipe(gulp.dest(config.folders.temp))

                // Task result
                .pipe(size({
                    title: "test html copy"
                }));
        });
    }
}

module.exports = new CopyTaskLoader();

