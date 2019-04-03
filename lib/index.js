"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* globals module, require */
var request_1 = require("./request");
exports.NodeRequest = request_1.default;
var response_1 = require("./response");
exports.NodeResponse = response_1.default;
var express_1 = require("./express");
exports.express = express_1.default;
// Because express router uses commonjs exports we have to handle it differently.
const Router = require('express/lib/router');
exports.Router = Router;
