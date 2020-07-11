"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
require("reflect-metadata");
var express_1 = require("express");
var next_1 = require("next");
var typeorm_1 = require("typeorm");
var health_check_1 = require("@server/modules/health-check");
var logger_1 = require("@server/modules/logger");
var file_loader_1 = require("@utils/file-loader");
var app_middleware_1 = require("@server/middleware/app-middleware");
var _config_1 = require("@config");
var core_middleware_1 = require("@server/middleware/core-middleware");
var register_routes_1 = require("./plugins/register-routes");
var register_middleware_1 = require("./plugins/register-middleware");
var isDev = process.env.NODE_ENV !== 'production';
var dbConnectionName = isDev ? 'development' : 'production';
var healthCheck = new health_check_1.HealthCheck();
var nextApp = next_1["default"]({ dev: isDev });
var handle = nextApp.getRequestHandler();
// Register types and resolvers
var routes = file_loader_1.fileLoader('routes', { flatten: true });
nextApp
    .prepare()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var expressApp, _a, host, port, serverInstance;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                expressApp = express_1["default"]();
                _a = _config_1.config.server, host = _a.host, port = _a.port;
                // Create database connection
                return [4 /*yield*/, typeorm_1.createConnection(dbConnectionName)];
            case 1:
                // Create database connection
                _b.sent();
                // Trusting proxy must be set for load balancing
                expressApp.set('trust proxy', true);
                // Register plugins
                return [4 /*yield*/, register_middleware_1.registerMiddleware(expressApp, __spreadArrays(core_middleware_1.coreMiddleware, [app_middleware_1.requestLogger]))];
            case 2:
                // Register plugins
                _b.sent();
                return [4 /*yield*/, register_routes_1.registerRoutes(expressApp, nextApp, routes)];
            case 3:
                _b.sent();
                // Health & graceful shutdown
                expressApp.get('/health/liveness', function (req, res) { return res.status(200).end(); });
                expressApp.get('/health/readiness', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var dbReady;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, healthCheck.isReady()];
                            case 1:
                                dbReady = _a.sent();
                                if (!dbReady)
                                    return [2 /*return*/, res.status(500).end()];
                                return [2 /*return*/, res.status(200).json({ status: 'ready' })];
                        }
                    });
                }); });
                // Catch all requests
                expressApp.get('*', function (req, res) {
                    return handle(req, res);
                });
                serverInstance = expressApp.listen(port, function () {
                    logger_1.logger.info({
                        host: host,
                        port: port,
                        env: process.env.NODE_ENV || 'development'
                    }, "Server has been started @ " + host + ":" + port);
                });
                process.on('SIGTERM', function () {
                    logger_1.logger.info('SERVER: Server shutting down');
                    healthCheck.setShuttingDown();
                    serverInstance.close(function (err) {
                        if (err) {
                            logger_1.logger.error({ err: err }, 'SERVER: Error closing server');
                            process.exit(1);
                        }
                        logger_1.logger.info('SERVER: Server closed');
                        process.exit(0);
                    });
                });
                expressApp.on('error', function (err) {
                    if (err.code === 'EADDRINUSE') {
                        logger_1.logger.info('Server address in use, retrying to start...');
                        setTimeout(function () {
                            serverInstance.close();
                            expressApp.listen(port, function () {
                                logger_1.logger.info({
                                    host: host,
                                    port: port,
                                    env: process.env.NODE_ENV || 'development'
                                }, "Server has been started @ " + host + ":" + port);
                            });
                        }, 1000);
                    }
                    throw err;
                });
                return [2 /*return*/];
        }
    });
}); })["catch"](function (err) {
    logger_1.logger.error({ err: err }, 'Next.js failed to start');
    process.exit(1);
});
