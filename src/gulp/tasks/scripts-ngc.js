"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
let exec = require("child_process").exec;

class ScriptsTypeScriptTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        gulp.task("scripts-ngc", "Run the Angular 2 NGC compiler", () =>{
            exec("./node_modules/.bin/ngc -p tsconfig-aot.json", (err, stdout, stderr) =>{
                console.log(stderr);
            });
        });
    }
}

module.exports = new ScriptsTypeScriptTaskLoader();

