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
var stripe_1 = require("stripe");
var logger_1 = require("@server/modules/logger");
var actor_1 = require("@server/entities/actor");
var customer_1 = require("@server/entities/customer");
var stripe = new stripe_1["default"](process.env.STRIPE, {
    apiVersion: '2020-03-02'
});
/**
 * Create a new customer
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
var createCustomer = function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
    var db, actor, customer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = context.db;
                return [4 /*yield*/, db.findOne(actor_1.Actor, { id: args.input.actorId })];
            case 1:
                actor = _a.sent();
                if (!actor) {
                    // Error
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                logger_1.logger.info('PAYMENT-RESOLVER: Creating new customer');
                return [4 /*yield*/, stripe.customers.create({
                        name: actor.firstName + " " + actor.lastName,
                        email: actor.email,
                        phone: "+" + actor.phoneCountryCode + actor.phone,
                        address: {
                            line1: actor.address1,
                            line2: actor.address2,
                            city: actor.city,
                            state: actor.state,
                            postal_code: actor.postalCode,
                            country: actor.country
                        },
                        metadata: { id: actor.id }
                    })];
            case 3:
                customer = _a.sent();
                return [2 /*return*/, __assign({}, customer)];
            case 4:
                error_1 = _a.sent();
                // Error
                return [2 /*return*/, undefined];
            case 5: return [2 /*return*/];
        }
    });
}); };
/**
 * Update an existing customer
 *
 * @param parent - The parent resolver
 * @param args - Actor input arguments
 * @param context - GraphQL context object
 * @param info - GraphQL metadata
 * @returns null
 */
var updateCustomer = function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
    var db, customer, updatedCustomer, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = context.db;
                customer = db.findOne(customer_1.Customer, { actor_id: args.input.actorId });
                if (!customer) {
                    // Error
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                logger_1.logger.info('CUSTOMER-RESOLVER: Updating customer');
                return [4 /*yield*/, stripe.customers.update(customer.stripeId, {
                        source: args.input.source
                    })];
            case 2:
                updatedCustomer = _a.sent();
                return [2 /*return*/, __assign({}, updatedCustomer)];
            case 3:
                error_2 = _a.sent();
                // Error
                return [2 /*return*/, undefined];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports["default"] = {
    Mutation: {
        createCustomer: createCustomer,
        updateCustomer: updateCustomer
    }
};
