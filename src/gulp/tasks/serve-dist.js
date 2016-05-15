"use strict";

import AbstractTaskLoader from "../abstractTaskLoader";
import config from "../config";
//import utils from "../utils";

const browserSync = require("browser-sync").create(config.webServerNames.dist);
let proxyMiddleware = require("http-proxy-middleware");

import historyApiFallback from "connect-history-api-fallback"; // fix for SPAs w/ BrowserSync & others: https://github.com/BrowserSync/browser-sync/issues/204

// let runSequence = require("run-sequence");
import runSequence from "run-sequence";

class ServeDistTaskLoader extends AbstractTaskLoader {
    registerTask(gulp){
        super.registerTask(gulp);

        let run = runSequence.use(gulp); // needed to bind to the correct gulp object (alternative is to pass gulp to runSequence as first argument)

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

        const startBrowserSync = () =>{
            browserSync.init({
                notify: false,
                //port: 8000,

                // Customize the BrowserSync console logging prefix
                logPrefix: "NBWA",

                // Run w/ https by uncommenting "https: true"
                // Note: this uses an unsigned certificate which on first access
                // will present a certificate warning in the browser.
                // https: true,
                server: {
                    baseDir: config.webServerFolders.dist,

                    // fix for SPAs w/ BrowserSync & others: https://github.com/BrowserSync/browser-sync/issues/204
                    // reference: https://github.com/BrowserSync/browser-sync/issues/204
                    // todo extract common middleware config
                    middleware: middleware
                },
                reloadDelay: 1000,
                reloadDebounce: 1000
            });
        };

        gulp.task("serve-dist", "Build and serve the production version (i.e., 'dist' folder contents", () =>{
            let tasks = [ "default" ];

            if(gulp.options.proxy){
                tasks.unshift("proxy");
            }

            return run(tasks, startBrowserSync); // here we need to ensure that all the other tasks are done before we start BrowserSync
        });
    }
}

module.exports = new ServeDistTaskLoader();
