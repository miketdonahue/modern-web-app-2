"use strict";
exports.__esModule = true;
exports.loginValidationSchema = void 0;
var Yup = require("yup");
exports.loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('must be a valid email format')
        .required('is required'),
    password: Yup.string().required('is required')
});
