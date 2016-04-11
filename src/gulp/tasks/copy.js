"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
import config from "../config";
import utils from "../utils";

import eventStream from "event-stream";
import size from "gulp-size";
//import debug from "gulp-debug";

class CopyTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        gulp.task("copy", "Copy all files except HTML/CSS/JS which are processed separately", () =>{
            // If the app src folder is overridden, then append it to the watch list, otherwise use default.
            let src = null;

            if(gulp.options.folders){
                src = [ gulp.options.folders.app + config.globs.any,
                        utils.exclude(gulp.options.folders.app + config.globs.html),
                        utils.exclude(gulp.options.folders.app + config.globs.styles.css),
                        utils.exclude(gulp.options.folders.app + config.globs.styles.sass),
                        utils.exclude(gulp.options.folders.app + config.globs.scripts.javascript),
                        utils.exclude(gulp.options.folders.app + config.globs.scripts.typescript) ];
            } else{
                src = config.copy.src;
            }

            return gulp.plumbedSrc(
                src, {
                    dot: true
                })

                // Display the files in the stream
                //.pipe(debug({title: "Stream contents:", minimal: true}))

                // Filter out the empty directories
                .pipe(utils.filterEmptyDirectories(eventStream))

                // Display the files in the stream
                //.pipe(debug({title: "Stream contents:", minimal: true}))

                // Copy
                .pipe(gulp.dest(config.copy.dest))

                // Task result
                .pipe(size({
                    title: "copy"
                }));
        });
    }
}

module.exports = new CopyTaskLoader();

