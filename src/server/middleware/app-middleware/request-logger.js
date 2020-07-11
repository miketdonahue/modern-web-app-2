"use strict";
exports.__esModule = true;
exports.requestLogger = void 0;
var logger_1 = require("@server/modules/logger");
/**
 * Generic Request Logger
 */
var requestLogger = {
    name: 'request-logger',
    "function": function (req, res, next) {
        if (req.url.startsWith('/_next'))
            return next();
        var startTime = process.hrtime();
        var originalResEnd = res.end;
        logger_1.logger.info({
            req: req,
            res: res
        }, 'Start request');
        res.end = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var diffTime = process.hrtime(startTime);
            var responseTime = (diffTime[0] * 1e9 + diffTime[1]) / 1e6;
            logger_1.logger.info({
                responseTime: responseTime + " ms"
            }, 'End request');
            originalResEnd.apply(res, args);
        };
        return next();
    }
};
exports.requestLogger = requestLogger;
