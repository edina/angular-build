"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
//import config from "../config";
import utils from "../utils";

//import debug from "gulp-debug";
// let path = require("path");
import path from "path";
import runSequence from "run-sequence";
// let runSequence = require("run-sequence");

class TestUnitTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        let run = runSequence.use(gulp); // needed to bind to the correct gulp object (alternative is to pass gulp to runSequence as first argument)

        let karmaConfigFilePath = path.resolve("karma.conf.js");

        let options = {
            path: karmaConfigFilePath,
            singleRun: true
        };

        gulp.task("test-unit", "Execute all unit tests", (callback) =>{
            return utils.getKarmaServer(options, callback);
        });

        gulp.task("test-unit-dev", "Execute all unit tests continuously (watches files)", (callback) =>{
            options.singleRun = false;

            return utils.getKarmaServer(options, callback);
        });

        gulp.task("prepare-test-unit", "Do all the necessary preparatory work for the test-unit task", () =>{
            return run([
                "clean",
                "ts-lint",
                "check-js-style",
                "check-js-quality"
            ], [
                "scripts-typescript",
                "scripts-javascript",
                "test-html-copy"
            ]);
        });
    }
}

module.exports = new TestUnitTaskLoader();
