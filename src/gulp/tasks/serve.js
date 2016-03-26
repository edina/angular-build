"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
import config from "../config";
import utils from "../utils";

let browserSync = require("browser-sync").create(config.webServerNames.dev);
let proxyMiddleware = require("http-proxy-middleware");

import historyApiFallback from "connect-history-api-fallback"; // fix for SPAs w/ BrowserSync & others: https://github.com/BrowserSync/browser-sync/issues/204
//import debug from "gulp-debug";

class ServeTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        let runSequence = require("run-sequence");

        runSequence = runSequence.use(gulp); // needed to bind to the correct gulp object (alternative is to pass gulp to runSequence as first argument)

        // TypeScript
        gulp.task("serve-scripts-typescript", "Transpile TypeScript to ES5 and reload the browser (this task should only be called during serve)", [ "prepare-serve-scripts-typescript" ], () =>{
            return browserSync.reload();
        });  // reload BrowserSync once everything is ready

        gulp.task("prepare-serve-scripts-typescript", "Transpile TypeScript to ES5 and generate sourcemaps", [
            "ts-lint"
        ], (callback) =>{
            return runSequence(
                "scripts-typescript",
                callback);
        });

        // JavaScript
        gulp.task("serve-scripts-javascript", "Transpile JavaScript to ES5 and reload the browser (this task should only be called during serve)", [ "prepare-serve-scripts-javascript" ], () =>{
            return browserSync.reload();
        }); // reload BrowserSync once everything is ready
        gulp.task("prepare-serve-scripts-javascript", "Transpile JavaScript to ES5 and generate sourcemaps", [
            "check-js-style",
            "check-js-quality"
        ], (callback) =>{
            return runSequence(
                "scripts-javascript",
                callback);
        });

        // configure proxy middleware
        // context: '/' will proxy all requests
        //     use: '/api' to proxy request when path starts with '/api'
        let proxy = null;
        let middleware = [
            historyApiFallback(), // not necessary if the app uses hash based routing
            function(req, res, next){
                res.setHeader("Access-Control-Allow-Origin", "*"); // add CORS to the response headers (for resources served by BrowserSync)
                next();
            }
        ];

        if(gulp.options.proxy){
            proxy = proxyMiddleware(gulp.options.proxy.api, {
                target: gulp.options.proxy.target + ":" + gulp.options.proxy.port,
                changeOrigin: true   // for vhosted sites, changes host header to match to target's host
            });

            middleware.unshift(proxy);
        }

        // let proxy = proxyMiddleware(gulp.options.proxy.api, {
        //     target: gulp.options.proxy.target + ":" + gulp.options.proxy.port,
        //     changeOrigin: true   // for vhosted sites, changes host header to match to target's host
        // });

        // If the app src folder is overridden, then append it to the watch list, otherwise use default.
        let baseDir = null;

        if(gulp.options.folders.app){
            baseDir = config.webServerFolders.dev.concat([ gulp.options.folders.app ]);
        } else{
            baseDir = config.webServerFolders.dev;
        }

        let browserSyncOptions = { // http://www.browsersync.io/docs/options/
            notify: false,
            //port: 8000,

            // Customize the BrowserSync console logging prefix
            logPrefix: "MWD", // Modern Web Dev

            // Run w/ https by uncommenting "https: true"
            // Note: this uses an unsigned certificate which on first access
            //       will present a certificate warning in the browser.
            // https: true,
            ghostMode: { // replicate actions in all clients
                clicks: false,
                forms: false,
                scroll: false
            },
            server: {
                baseDir: baseDir,
                //routes: alternative way to map content that is above the base dir
                // fix for SPAs w/ BrowserSync & others: https://github.com/BrowserSync/browser-sync/issues/204
                // reference: https://github.com/BrowserSync/browser-sync/issues/204
                // middleware: proxyMiddleware('/api', {target: 'http://localhost:8000'})
                middleware: middleware
            }//,
            //reloadDebounce: 500 // restrict the frequency in which browser reload events can be emitted to connected clients
        };

        // If the app src folder is overridden, then append it to the watch list, otherwise use default.
        let html = null;
        let styles = null;
        let typescript = null;
        let javascript = null;
        let images = null;

        if(gulp.options.folders.app){
            html = [ gulp.options.folders.app + config.globs.html ];
            styles = [ gulp.options.folders.app + config.globs.styles.css, gulp.options.folders.app + config.globs.styles.sass ];
            typescript = [ gulp.options.folders.app + config.globs.scripts.typescript ];
            javascript = [ gulp.options.folders.app + config.globs.scripts.javascript ];
            images = [ gulp.options.folders.app + config.globs.images ];
        } else{
            html = config.html.src;
            styles = config.styles.src;
            typescript = config.typescript.srcAppOnly;
            javascript = config.javascript.src;
            images = config.images.src;
        }

        let startBrowserSync = () =>{
            browserSync.init(utils.mergeOptions(browserSyncOptions, gulp.options.browserSync));

            gulp.watch(html).on("change", browserSync.reload); // force a reload when html changes
            gulp.watch(styles, [ "styles" ]); // stylesheet changes will be streamed if possible or will force a reload
            gulp.watch(typescript, [ "serve-scripts-typescript" ]); // TypeScript changes will force a reload
            gulp.watch(javascript, [ "serve-scripts-javascript" ]); // JavaScript changes will force a reload
            gulp.watch(images).on("change", browserSync.reload); // force a reload when images change
        };

        gulp.task("serve", "Watch files for changes and rebuild/reload automagically", () =>{
            runSequence("prepare-serve", startBrowserSync); // here we need to ensure that all the other tasks are done before we start BrowserSync
        });

        gulp.task("prepare-serve", "Do all the necessary preparatory work for the serve task", () =>{
            return runSequence([
                "clean",
                "ts-lint",
                "check-js-style",
                "check-js-quality"
            ], [
                "scripts-typescript",
                "scripts-javascript",
                "styles",
                "validate-package-json"
            ]);
        });
    }
}

module.exports = new ServeTaskLoader();
