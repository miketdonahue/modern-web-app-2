"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.logoutActor = exports.sendAuthEmail = exports.forgotPassword = exports.loginActor = exports.confirmActor = exports.registerActor = void 0;
var argon2_1 = require("argon2");
var jsonwebtoken_1 = require("jsonwebtoken");
var date_fns_1 = require("date-fns");
var uuid_1 = require("uuid");
var universal_cookie_1 = require("universal-cookie");
var db_manager_1 = require("@server/modules/db-manager");
var code_1 = require("@server/modules/code");
var logger_1 = require("@server/modules/logger");
var api_response_1 = require("@server/modules/api-response");
var errors_1 = require("@server/modules/errors");
var actor_1 = require("@server/entities/actor");
var actor_account_1 = require("@server/entities/actor-account");
var role_1 = require("@server/entities/role");
var blacklisted_token_1 = require("@server/entities/blacklisted-token");
// import {
//   WELCOME_EMAIL,
//   CONFIRM_EMAIL,
//   UNLOCK_ACCOUNT_EMAIL,
// } from '@server/modules/mailer';
var _config_1 = require("@config");
var utilities_1 = require("@server/modules/utilities");
/**
 * Registers a new actor
 */
var registerActor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, role, password, actorAccount, actor, actorIdToken, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = db_manager_1.getManager();
                return [4 /*yield*/, db.findOne(role_1.Role, { name: role_1.RoleName.ACTOR })];
            case 1:
                role = _a.sent();
                logger_1.logger.info('AUTH-CONTROLLER: Hashing password');
                return [4 /*yield*/, argon2_1["default"].hash(req.body.password, {
                        timeCost: 2000,
                        memoryCost: 500
                    })];
            case 2:
                password = _a.sent();
                return [4 /*yield*/, db.transaction(function (transactionalEntityManager) { return __awaiter(void 0, void 0, void 0, function () {
                        var createdActor, createdActorAccount;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger_1.logger.info('AUTH-CONTROLLER: Creating actor');
                                    return [4 /*yield*/, transactionalEntityManager.create(actor_1.Actor, {
                                            role_id: role === null || role === void 0 ? void 0 : role.uuid,
                                            first_name: req.body.firstName,
                                            last_name: req.body.lastName,
                                            email: req.body.email,
                                            password: password
                                        })];
                                case 1:
                                    createdActor = _a.sent();
                                    return [4 /*yield*/, transactionalEntityManager.save(createdActor)];
                                case 2:
                                    _a.sent();
                                    logger_1.logger.info('AUTH-CONTROLLER: Creating actor account');
                                    return [4 /*yield*/, db.create(actor_account_1.ActorAccount, {
                                            actor_id: createdActor.uuid,
                                            confirmed_code: _config_1.config.server.auth.confirmable ? code_1["default"]() : null,
                                            confirmed_expires: String(date_fns_1.addMinutes(new Date(), _config_1.config.server.auth.codes.expireTime)),
                                            last_visit: new Date(),
                                            ip: req.ip
                                        })];
                                case 3:
                                    createdActorAccount = _a.sent();
                                    return [4 /*yield*/, transactionalEntityManager.save(createdActorAccount)];
                                case 4:
                                    _a.sent();
                                    return [2 /*return*/, createdActorAccount];
                            }
                        });
                    }); })];
            case 3:
                actorAccount = _a.sent();
                return [4 /*yield*/, db.query("\n    SELECT\n      actor.*,\n      actor_account.confirmed_code\n    FROM\n      actor\n      INNER JOIN actor_account ON actor_account.actor_id = actor.uuid\n    WHERE\n      actor.uuid = $1\n  ", [actorAccount.actor_id])];
            case 4:
                actor = (_a.sent())[0];
                logger_1.logger.info('AUTH-CONTROLLER: Signing actor id token');
                actorIdToken = jsonwebtoken_1["default"].sign({ actor_id: actor.uuid }, _config_1.config.server.auth.jwt.secret);
                // TODO: change to `secure: true` when HTTPS
                res.cookie('actor', actorIdToken, {
                    path: '/',
                    secure: false
                });
                /* Sending emails */
                logger_1.logger.info({ emails: ['welcome', 'confirm-email'] }, 'AUTH-CONTROLLER: Sending emails');
                response = {
                    data: { id: actor.uuid, type: api_response_1.resourceTypes.ACTOR }
                };
                return [2 /*return*/, res.json(response)];
        }
    });
}); };
exports.registerActor = registerActor;
/**
 * Confirms a new actor's account
 */
var confirmActor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, cookies, token, decoded, actorAccount, errorResponse, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = db_manager_1.getManager();
                cookies = new universal_cookie_1["default"](req.headers.cookie);
                token = cookies.get('actor');
                decoded = jsonwebtoken_1["default"].decode(token);
                return [4 /*yield*/, db.findOne(actor_account_1.ActorAccount, {
                        actor_id: decoded.actor_id,
                        confirmed_code: req.body.code
                    })];
            case 1:
                actorAccount = _a.sent();
                if (!actorAccount) {
                    errorResponse = {
                        error: [
                            {
                                status: '400',
                                code: errors_1.errorTypes.CODE_NOT_FOUND.code,
                                detail: errors_1.errorTypes.CODE_NOT_FOUND.detail
                            },
                        ]
                    };
                    logger_1.logger.warn('AUTH-CONTROLLER: The actor account was not found');
                    return [2 /*return*/, res.status(400).json(errorResponse)];
                }
                logger_1.logger.info('AUTH-CONTROLLER: Confirming actor account');
                return [4 /*yield*/, db.update(actor_account_1.ActorAccount, { uuid: actorAccount.uuid }, {
                        confirmed: true,
                        confirmed_code: null,
                        confirmed_expires: null
                    })];
            case 2:
                _a.sent();
                // Remove 'actor' cookie
                res.cookie('actor', '', { expires: new Date(0) });
                response = {
                    data: { id: actorAccount.actor_id, type: api_response_1.resourceTypes.ACTOR }
                };
                return [2 /*return*/, res.json(response)];
        }
    });
}); };
exports.confirmActor = confirmActor;
/**
 * Logs in an actor
 */
var loginActor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, role, actorAccount, errorResponse, passwordMatch, refreshToken, token, _a, tokenHeader, tokenBody, tokenSignature, rememberMeDate, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                db = db_manager_1.getManager();
                return [4 /*yield*/, db.findOne(role_1.Role, { name: role_1.RoleName.ACTOR })];
            case 1:
                role = _b.sent();
                return [4 /*yield*/, db.query("\n    SELECT\n      actor_account.*,\n      actor.password\n    FROM\n      actor_account\n      INNER JOIN actor ON actor_account.actor_id = actor.uuid\n    WHERE\n      actor.email = $1\n  ", [req.body.email])];
            case 2:
                actorAccount = (_b.sent())[0];
                errorResponse = {
                    error: [
                        {
                            status: '400',
                            code: errors_1.errorTypes.INVALID_CREDENTIALS.code,
                            detail: errors_1.errorTypes.INVALID_CREDENTIALS.detail
                        },
                    ]
                };
                if (!actorAccount) {
                    logger_1.logger.error('AUTH-CONTROLLER: The actor account was not found');
                    return [2 /*return*/, res.status(400).json(errorResponse)];
                }
                return [4 /*yield*/, argon2_1["default"].verify(actorAccount.password, req.body.password)];
            case 3:
                passwordMatch = _b.sent();
                refreshToken = jsonwebtoken_1["default"].sign({ hash: uuid_1.v4() }, _config_1.config.server.auth.jwt.refreshSecret, {
                    expiresIn: _config_1.config.server.auth.jwt.refreshExpiresIn
                });
                return [4 /*yield*/, db.update(actor_account_1.ActorAccount, { uuid: actorAccount.uuid }, !passwordMatch
                        ? {
                            login_attempts: actorAccount.login_attempts + 1,
                            locked: actorAccount.login_attempts >=
                                _config_1.config.server.auth.lockable.maxAttempts
                        }
                        : {
                            last_visit: new Date(),
                            ip: req.ip,
                            login_attempts: 0,
                            refresh_token: refreshToken
                        })];
            case 4:
                _b.sent();
                if (!passwordMatch) {
                    logger_1.logger.error('AUTH-CONTROLLER: The actor password did not match our records');
                    return [2 /*return*/, res.status(400).json(errorResponse)];
                }
                logger_1.logger.info('AUTH-CONTROLLER: Signing auth tokens');
                token = jsonwebtoken_1["default"].sign({ actor_id: actorAccount.actor_id, role: utilities_1.transformRoleForToken(role) }, _config_1.config.server.auth.jwt.secret, { expiresIn: _config_1.config.server.auth.jwt.expiresIn });
                _a = token.split('.'), tokenHeader = _a[0], tokenBody = _a[1], tokenSignature = _a[2];
                rememberMeDate = date_fns_1.addDays(new Date(), _config_1.config.server.auth.cookieExpiresIn);
                // TODO: change to `secure: true` when HTTPS
                res.cookie('token-payload', tokenHeader + "." + tokenBody, __assign({ path: '/', secure: false }, (req.body.rememberMe && { expires: rememberMeDate })));
                res.cookie('token-signature', tokenSignature, __assign({ path: '/', httpOnly: true, secure: false }, (req.body.rememberMe && { expires: rememberMeDate })));
                response = {
                    data: {
                        id: actorAccount.actor_id,
                        type: api_response_1.resourceTypes.ACTOR,
                        attributes: { token: token }
                    }
                };
                return [2 /*return*/, res.json(response)];
        }
    });
}); };
exports.loginActor = loginActor;
/**
 * Generate a reset token so a actor can reset their password
 */
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, actorAccount, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = db_manager_1.getManager();
                return [4 /*yield*/, db.query("\n    SELECT\n      actor_account.*\n    FROM\n      actor_account\n      INNER JOIN actor ON actor_account.actor_id = actor.uuid\n    WHERE\n      actor.email = $1\n  ", [req.body.email])];
            case 1:
                actorAccount = (_a.sent())[0];
                if (!actorAccount) {
                    logger_1.logger.error('AUTH-CONTROLLER: The actor account was not found');
                    return [2 /*return*/, res.end()];
                }
                logger_1.logger.info("AUTH-CONTROLLER: Preparing actor's password for reset");
                return [4 /*yield*/, db.update(actor_account_1.ActorAccount, { uuid: actorAccount.uuid }, {
                        reset_password_code: code_1["default"](),
                        reset_password_expires: String(date_fns_1.addMinutes(new Date(), _config_1.config.server.auth.codes.expireTime))
                    })];
            case 2:
                _a.sent();
                response = {
                    data: {
                        id: actorAccount.actor_id,
                        type: api_response_1.resourceTypes.ACTOR
                    }
                };
                return [2 /*return*/, res.json(response)];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
/**
 * Send an authentication-related email
 *
 * @description Used when needing to resend an auth related email
 */
var sendAuthEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, actor, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = db_manager_1.getManager();
                return [4 /*yield*/, db.query("\n    SELECT\n      actor_account.confirmed_code,\n      actor_account.locked_code,\n      actor.uuid,\n      actor.email,\n      actor.first_name\n    FROM\n      actor_account\n      INNER JOIN actor ON actor_account.actor_id = actor.uuid\n    WHERE\n      actor.email = $1\n  ", [req.body.email])];
            case 1:
                actor = (_a.sent())[0];
                // const emailType = {
                //   CONFIRM_EMAIL,
                //   UNLOCK_ACCOUNT_EMAIL,
                // };
                logger_1.logger.info({ type: req.body.type }, 'AUTH-CONTROLLER: Sending email to actor');
                response = {
                    data: {
                        id: actor.uuid,
                        type: api_response_1.resourceTypes.ACTOR
                    }
                };
                return [2 /*return*/, res.json(response)];
        }
    });
}); };
exports.sendAuthEmail = sendAuthEmail;
/**
 * Logout an actor
 */
var logoutActor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, cookies, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = db_manager_1.getManager();
                cookies = new universal_cookie_1["default"](req.headers.cookie);
                signature = cookies.get('token-signature');
                logger_1.logger.info('AUTH-CONTROLLER: Logging out actor');
                return [4 /*yield*/, db.insert(blacklisted_token_1.BlacklistedToken, {
                        token: req.body.token + "." + signature
                    })];
            case 1:
                _a.sent();
                res.cookie('token-payload', '', { expires: new Date(0) });
                res.cookie('token-signature', '', { expires: new Date(0) });
                return [2 /*return*/, res.end()];
        }
    });
}); };
exports.logoutActor = logoutActor;
