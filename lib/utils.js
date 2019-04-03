/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';
/**
 * Module dependencies.
 * @api private
 */
var contentType = require('content-type');
var mime = require('send').mime;
/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 * also includes `.originalIndex` for stable sorting
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */
function acceptParams(str, index = 0) {
    var parts = str.split(/ *; */);
    var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };
    for (var i = 1; i < parts.length; ++i) {
        var pms = parts[i].split(/ *= */);
        if ('q' === pms[0]) {
            ret.quality = parseFloat(pms[1]);
        }
        else {
            ret.params[pms[0]] = pms[1];
        }
    }
    return ret;
}
/**
 * Return strong ETag for `body`.
 *
 * @param {String|Buffer} body
 * @param {String} [encoding]
 * @return {String}
 * @api private
 */
/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */
exports.isAbsolute = function (path) {
    if ('/' === path[0])
        return true;
    if (':' === path[1] && ('\\' === path[2] || '/' === path[2]))
        return true; // Windows device path
    if ('\\\\' === path.substring(0, 2))
        return true; // Microsoft Azure absolute path
};
/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */
exports.normalizeType = function (type) {
    return ~type.indexOf('/')
        ? acceptParams(type)
        : { value: mime.lookup(type), params: {} };
};
/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */
exports.normalizeTypes = function (types) {
    var ret = [];
    for (var i = 0; i < types.length; ++i) {
        ret.push(exports.normalizeType(types[i]));
    }
    return ret;
};
exports.setCharset = function setCharset(type, charset) {
    if (!type || !charset) {
        return type;
    }
    // parse type
    var parsed = contentType.parse(type);
    // set charset
    parsed.parameters.charset = charset;
    // format type
    return contentType.format(parsed);
};
