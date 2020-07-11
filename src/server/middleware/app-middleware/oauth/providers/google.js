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
exports.__esModule = true;
exports.authenticate = exports.verify = exports.authorize = void 0;
var googleapis_1 = require("googleapis");
var jsonwebtoken_1 = require("jsonwebtoken");
var uuid_1 = require("uuid");
var typeorm_1 = require("typeorm");
var code_1 = require("@server/modules/code");
var logger_1 = require("@server/modules/logger");
var actor_1 = require("@server/entities/actor");
var actor_account_1 = require("@server/entities/actor-account");
var role_1 = require("@server/entities/role");
var oauth_1 = require("@server/entities/oauth");
var _config_1 = require("@config");
var utilities_1 = require("@server/modules/utilities");
var isDev = process.env.NODE_ENV !== 'production';
var dbConnectionName = isDev ? 'development' : 'production';
var oauthConfig = {
    callbackUrl: 'http://localhost:8080/app/oauth/google/callback',
    successRedirect: '/app',
    failureRedirect: '/app/login'
};
/**
 * Send user to OAuth provider login page
 *
 * @remarks
 * This is an Express.js route callback function signature.
 *
 * @param req - Express.js request objet
 * @param res - Express.js response object
 * @returns Redirect to provider login
 */
exports.authorize = function (req, res) {
    var oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET, oauthConfig.callbackUrl);
    var scopes = ['https://www.googleapis.com/auth/userinfo.email'];
    var state = jsonwebtoken_1["default"].sign({ state: uuid_1.v4() }, _config_1.config.server.auth.jwt.secret, {
        expiresIn: '1m'
    });
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        state: state,
        scope: scopes
    });
    logger_1.logger.info({ provider: 'google', method: 'authorize' }, 'OPEN-AUTH-MIDDLEWARE: Redirecting to provider');
    return res.redirect(302, url);
};
/**
 * Verify an OAuth user coming back from the provider's login flow
 *
 * @remarks
 * This function will do the following:
 *    - Verify the state param for CSRF protection
 *    - If not user currently exists in the DB, create one
 *    - Exchange the access code for an access token
 *    - Create an OAuth DB entry
 *    - Attach the user to req.actor and move forward to next middleware in the chain
 *
 * @returns An Express.js middleware closure
 */
exports.verify = {
    name: 'oauth-google-verify',
    "function": function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var oauth2Client, db, code, verifiedState, tokens, decoded, actor, role_2, insertedActor, actorData, refreshToken, expiresAt, existingOauth, err_1, role;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET, oauthConfig.callbackUrl);
                    db = typeorm_1.getConnection(dbConnectionName);
                    code = req.query.code;
                    verifiedState = jsonwebtoken_1["default"].verify(req.query.state, _config_1.config.server.auth.jwt.secret);
                    return [4 /*yield*/, oauth2Client.getToken(code)];
                case 1:
                    tokens = (_a.sent()).tokens;
                    decoded = jsonwebtoken_1["default"].decode(tokens.id_token);
                    return [4 /*yield*/, db.manager.findOne(actor_1.Actor, { email: decoded.email })];
                case 2:
                    actor = _a.sent();
                    if (!verifiedState) {
                        logger_1.logger.error({ state: verifiedState.state }, 'OPEN-AUTH-MIDDLEWARE: Could not verify oauth state session value');
                        return [2 /*return*/, res.redirect(302, oauthConfig.failureRedirect)];
                    }
                    if (!!actor) return [3 /*break*/, 6];
                    return [4 /*yield*/, db.manager.findOne(role_1.Role, {
                            name: role_1.RoleName.ACTOR
                        })];
                case 3:
                    role_2 = _a.sent();
                    logger_1.logger.info({ provider: 'google', method: 'verify' }, 'OPEN-AUTH-MIDDLEWARE: Creating user');
                    return [4 /*yield*/, db.manager.insert(actor_1.Actor, {
                            role_id: role_2.uuid,
                            email: decoded.email
                        })];
                case 4:
                    insertedActor = _a.sent();
                    actorData = insertedActor.raw[0];
                    actor = actorData;
                    return [4 /*yield*/, db.manager.insert(actor_account_1.ActorAccount, {
                            actor_id: actor.uuid,
                            confirmed_code: _config_1.config.server.auth.confirmable ? code_1["default"]() : null
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    refreshToken = tokens.refresh_token;
                    expiresAt = tokens.expiry_date;
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 13, , 14]);
                    return [4 /*yield*/, db.manager.findOne(oauth_1.Oauth, {
                            actor_id: actor.uuid,
                            provider: oauth_1.ProviderName.GOOGLE
                        })];
                case 8:
                    existingOauth = _a.sent();
                    if (!existingOauth) return [3 /*break*/, 10];
                    logger_1.logger.info({ id: existingOauth.uuid, provider: 'google', method: 'verify' }, 'OPEN-AUTH-MIDDLEWARE: Updating existing oauth record');
                    return [4 /*yield*/, db.manager.update(oauth_1.Oauth, { uuid: existingOauth.uuid }, {
                            refresh_token: refreshToken,
                            expires_at: new Date(expiresAt)
                        })];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 10:
                    logger_1.logger.info({ provider: 'google', method: 'verify' }, 'OPEN-AUTH-MIDDLEWARE: Creating new oauth record');
                    return [4 /*yield*/, db.manager.insert(oauth_1.Oauth, {
                            actor_id: actor.uuid,
                            provider: oauth_1.ProviderName.GOOGLE,
                            refresh_token: refreshToken,
                            expires_at: new Date(expiresAt)
                        })];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_1 = _a.sent();
                    logger_1.logger.error({ actorId: actor.uuid, err: err_1 }, 'OPEN-AUTH-MIDDLEWARE: Could not update or add open auth details to database');
                    return [2 /*return*/, res.redirect(302, oauthConfig.failureRedirect)];
                case 14: return [4 /*yield*/, db.manager.findOne(role_1.Role, { uuid: actor.role_id })];
                case 15:
                    role = _a.sent();
                    req.actor = {
                        uuid: actor.uuid,
                        role: utilities_1.transformRoleForToken(role)
                    };
                    return [2 /*return*/, next()];
            }
        });
    }); }
};
/**
 * Authenticates a user coming back from a provider flow
 *
 * @remarks
 * This function is called after a user successfully authenticates with an OAuth provider.
 * It will update a few properties on the user account, sign a new token, and set the token cookie
 * This is an Express.js route callback function signature.
 *
 * @param req - Express.js request objet
 * @param res - Express.js response object
 * @returns Redirect to the "success" route, usually the root path
 */
exports.authenticate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, actor, err_2, token, _a, _b, tokenHeader, _c, tokenBody, _d, tokenSignature;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                db = typeorm_1.getConnection(dbConnectionName);
                actor = req.actor;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db.manager.update(actor_account_1.ActorAccount, { actor_id: actor.uuid }, { last_visit: new Date(), ip: req.ip })];
            case 2:
                _e.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _e.sent();
                logger_1.logger.error({ actorId: actor.uuid, err: err_2 }, 'OPEN-AUTH-MIDDLEWARE: Could not update user account database table');
                return [2 /*return*/, res.redirect(302, oauthConfig.failureRedirect)];
            case 4:
                logger_1.logger.info({ provider: 'google', method: 'authenticate' }, 'OPEN-AUTH-MIDDLEWARE: Signing token');
                token = jsonwebtoken_1["default"].sign({ actor_id: actor.uuid, role: actor.role }, _config_1.config.server.auth.jwt.secret, { expiresIn: _config_1.config.server.auth.jwt.expiresIn });
                logger_1.logger.info({ provider: 'google', method: 'authenticate' }, 'OPEN-AUTH-MIDDLEWARE: Setting jwt cookie and redirecting');
                _a = token.split('.'), _b = _a[0], tokenHeader = _b === void 0 ? '' : _b, _c = _a[1], tokenBody = _c === void 0 ? '' : _c, _d = _a[2], tokenSignature = _d === void 0 ? '' : _d;
                // TODO: change to `secure: true` when HTTPS
                res.cookie('token-payload', tokenHeader + "." + tokenBody, {
                    path: '/',
                    secure: false
                });
                res.cookie('token-signature', tokenSignature, {
                    path: '/',
                    httpOnly: true,
                    secure: false
                });
                return [2 /*return*/, res.redirect(302, oauthConfig.successRedirect)];
        }
    });
}); };
