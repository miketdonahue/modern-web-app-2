"use strict";
exports.__esModule = true;
exports.unlockAccountValidationSchema = void 0;
var Yup = require("yup");
exports.unlockAccountValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('must be a valid email format')
        .required('is required')
});
