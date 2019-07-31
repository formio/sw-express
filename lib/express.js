"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const response_1 = require("./response");
const Router = require('express/lib/router');
function default_1(options = {}) {
    const app = new Router(options);
    console.log('initializing router');
    app.getOption = (name) => {
        if (options.hasOwnProperty(name)) {
            return options[name];
        }
        return '';
    };
    app.handleFetch = (event) => {
        event.respondWith(new Promise((resolve) => {
            const req = new request_1.default(app, event.request);
            const res = new response_1.default(app, resolve);
            req.res = res;
            res.req = req;
            // Handle query separately.
            const url = new URL(event.request.url);
            const searchParams = new URLSearchParams(url.search);
            req.query = {};
            for (const [key, value] of searchParams.entries()) {
                req.query[key] = value;
            }
            app.handle(req, res, () => {
                console.log(event.request.url, 'Request finished with no handlers');
            });
        }));
    };
    app.listen = (host) => {
        app.host = host;
        self.addEventListener('fetch', (event) => {
            // If the request is not to our host, respond as normal.
            if (!event.request.url.startsWith(host)) {
                return event.respondWith(fetch(event.request));
            }
            app.handleFetch(event);
        });
    };
    return app;
}
exports.default = default_1;
;
