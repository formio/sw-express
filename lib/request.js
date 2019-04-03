"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accepts_1 = require("accepts");
const is_ip_1 = require("is-ip");
const parseRange = require('range-parser');
class NodeRequest {
    constructor(app, request) {
        /**
         * To do: update docs.
         *
         * Check if the given `type(s)` is acceptable, returning
         * the best match when true, otherwise `undefined`, in which
         * case you should respond with 406 "Not Acceptable".
         *
         * The `type` value may be a single MIME type string
         * such as "application/json", an extension name
         * such as "json", a comma-delimited list such as "json, html, text/plain",
         * an argument list such as `"json", "html", "text/plain"`,
         * or an array `["json", "html", "text/plain"]`. When a list
         * or array is given, the _best_ match, if any is returned.
         *
         * Examples:
         *
         *     // Accept: text/html
         *     req.accepts('html');
         *     // => "html"
         *
         *     // Accept: text/*, application/json
         *     req.accepts('html');
         *     // => "html"
         *     req.accepts('text/html');
         *     // => "text/html"
         *     req.accepts('json, text');
         *     // => "json"
         *     req.accepts('application/json');
         *     // => "application/json"
         *
         *     // Accept: text/*, application/json
         *     req.accepts('image/png');
         *     req.accepts('png');
         *     // => undefined
         *
         *     // Accept: text/*;q=.5, application/json
         *     req.accepts(['html', 'json']);
         *     req.accepts('html', 'json');
         *     req.accepts('html, json');
         *     // => "json"
         *
         * @param {String|Array} type(s)
         * @return {String|Array|Boolean}
         * @public
         */
        this.accepts = function () {
            var accept = accepts_1.default(this);
            return accept.types.apply(accept, arguments);
        };
        /**
         * Check if the given `encoding`s are accepted.
         *
         * @param {String} ...encoding
         * @return {String|Array}
         * @public
         */
        this.acceptsEncodings = function () {
            var accept = accepts_1.default(this);
            return accept.encodings.apply(accept, arguments);
        };
        /**
         * Check if the given `charset`s are acceptable,
         * otherwise you should respond with 406 "Not Acceptable".
         *
         * @param {String} ...charset
         * @return {String|Array}
         * @public
         */
        this.acceptsCharsets = function () {
            var accept = accepts_1.default(this);
            return accept.charsets.apply(accept, arguments);
        };
        /**
         * Check if the given `lang`s are acceptable,
         * otherwise you should respond with 406 "Not Acceptable".
         *
         * @param {String} ...lang
         * @return {String|Array}
         * @public
         */
        this.acceptsLanguages = function () {
            var accept = accepts_1.default(this);
            return accept.languages.apply(accept, arguments);
        };
        /**
         * Parse Range header field, capping to the given `size`.
         *
         * Unspecified ranges such as "0-" require knowledge of your resource length. In
         * the case of a byte range this is of course the total number of bytes. If the
         * Range header field is not given `undefined` is returned, `-1` when unsatisfiable,
         * and `-2` when syntactically invalid.
         *
         * When ranges are returned, the array has a "type" property which is the type of
         * range that is required (most commonly, "bytes"). Each array element is an object
         * with a "start" and "end" property for the portion of the range.
         *
         * The "combine" option can be set to `true` and overlapping & adjacent ranges
         * will be combined into a single range.
         *
         * NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
         * should respond with 4 users when available, not 3.
         *
         * @param {number} size
         * @param {object} [options]
         * @param {boolean} [options.combine=false]
         * @return {number|array}
         * @public
         */
        this.range = function range(size, options) {
            var range = this.get('Range');
            if (!range)
                return;
            return parseRange(size, range, options);
        };
        this.app = app;
        this.request = request.clone();
    }
    destroy(error) {
        // Todo: implement
        console.log('Called unsupported request.destroy', error);
    }
    get headers() {
        return this.request.headers;
    }
    get httpVersion() {
        return '1.1';
    }
    get method() {
        return this.request.method.toUpperCase();
    }
    get rawHeaders() {
        return this.request.headers.toString();
    }
    get rawTrailers() {
        return '';
    }
    setTimeout(msecs, callback) {
        return setTimeout(callback, msecs);
    }
    get socket() {
        // Todo: implement
        console.log('Called unsupported request.socket');
        return;
    }
    get url() {
        return this.request.url;
    }
    on(event, func) {
        // Todo: implement
        console.log('Called unsupported on ' + event);
    }
    get(name) {
        return this.header(name);
    }
    header(name) {
        if (!name) {
            throw new TypeError('name argument is required to req.get');
        }
        if (typeof name !== 'string') {
            throw new TypeError('name must be a string to req.get');
        }
        const lc = name.toLowerCase();
        switch (lc) {
            case 'referer':
            case 'referrer':
                return this.headers.get('referrer')
                    || this.headers.get('referer');
            default:
                return this.headers.get(lc);
        }
    }
    param(name, defaultValue) {
        var params = this.params || {};
        var body = this.body || {};
        var query = this.query || {};
        if (null != params[name] && params.hasOwnProperty(name))
            return params[name];
        if (null != body[name])
            return body[name];
        if (null != query[name])
            return query[name];
        return defaultValue;
    }
    get protocol() {
        return '';
    }
    get secure() {
        return '';
    }
    get ip() {
        return '';
    }
    get subdomains() {
        var hostname = this.hostname;
        if (!hostname)
            return [];
        var offset = this.app.getOption('subdomain offset');
        var subdomains = !is_ip_1.default(hostname)
            ? hostname.split('.').reverse()
            : [hostname];
        return subdomains.slice(offset);
    }
    get path() {
        const url = new URL(this.request.url);
        return url.pathname;
    }
    get hostname() {
        if (!this.app.host)
            return;
        // IPv6 literal support
        var offset = this.app.host[0] === '['
            ? this.app.host.indexOf(']') + 1
            : 0;
        var index = this.app.host.indexOf(':', offset);
        return index !== -1
            ? this.app.host.substring(0, index)
            : this.app.host;
    }
    get host() {
        return this.hostname;
    }
    get fresh() {
        // TODO: implement.
        return false;
    }
    get stale() {
        return !this.fresh;
    }
    get xhr() {
        var val = this.get('X-Requested-With') || '';
        return val.toLowerCase() === 'xmlhttprequest';
    }
}
exports.default = NodeRequest;
