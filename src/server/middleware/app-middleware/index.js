"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
var request_logger_1 = require("./request-logger");
__createBinding(exports, request_logger_1, "requestLogger");
var secure_api_1 = require("./secure-api");
__createBinding(exports, secure_api_1, "secureApi");
var secure_page_1 = require("./secure-page");
__createBinding(exports, secure_page_1, "securePage");
var oauth_1 = require("./oauth");
__createBinding(exports, oauth_1, "default", "oauth");
