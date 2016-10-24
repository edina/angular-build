"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
import config from "../config";
//import utils from "../utils";

import del from "del";

class CleanTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        let srcFolder = gulp.options.folders ? gulp.options.folders.app : config.folders.app;

        gulp.task("clean", "Clean output directories", () =>{
            del([
                    config.folders.temp,
                    config.folders.dist + config.globs.any,
                    srcFolder + config.globs.scripts.ngFactories
                ], {
                    dot: true
                }
            );
        });
    }
}

module.exports = new CleanTaskLoader();
