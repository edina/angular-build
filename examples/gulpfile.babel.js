/*
 The build is provided by the node-build-web-app: https://github.com/marksmall/node-build-web-app
 */
"use strict";

import gulp from "gulp";
import requireDir from "require-dir";
import build from "node-build-web-app";

let options = {};

/*
 (Optional) distEntryPoint (default: core/boot.js)
 Define the entry point for the creation of the production bundle.
 The extension does not need to be specified (SystemJS is used to load the file)
 */
// options.distEntryPoint = "core/core.bootstrap";


/*
 (Optional) minifyProductionJSBundle (default: true)
 Set this option to false, if you don't want a minified JS bundle.
 */
options.minifyProductionHTML = false; // HTML minification is currently not supported by Angular 2 beta: https://github.com/dsebastien/modernWebDevBuild/issues/67


/*
 (Optional) minifyProductionJSBundle (default: true)
 Set this option to false, if you don't want a minified JS bundle.
 */
//options.minifyProductionJSBundle = false;


/*
 (Optional) mangleProductionJSBundle (default: true)
 Set this option to false, if you don't want a mangled JS bundle.
 */
options.mangleProductionJSBundle = false; // Mangled JS bundles are currently not supported by Angular 2 beta: https://github.com/angular/angular/issues/6380


/*
 (Optional) useJSPM (default: true)
 Set this option to false, if you don't want to use the JSPM API to create the production bundle.
 If you disable the usage of JSPM, then the SystemJS builder API will be used to create the production bundle.
 (more: https://www.npmjs.com/package/systemjs-builder)
 */
//options.useJSPM = false;


/*
 (Optional) systemjsConfigurationFile (default: jspm.conf.js)
 Set the file name for the configuration file for SystemJS.
 (read also: useJSPM)
 */
//options.systemjsConfigurationFile = "my-systemjs.config.js";

/*
  Set API proxy, this is the URL to listen for calls on, if one received, forward it on to the
  target URL.
*/
options.proxy = {
	api: '/api',
	target: 'http://localhost',
	port: 8000
};

// Register all node-build-web-app build tasks.
build.registerTasks(gulp, options);

// Require all tasks/modules in ./gulp, including sub folders
exports.options = options;
requireDir('./gulp/tasks', { recurse: true });

