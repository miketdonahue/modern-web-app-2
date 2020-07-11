"use strict";
exports.__esModule = true;
exports.registerValidationSchema = void 0;
var Yup = require("yup");
exports.registerValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('is required'),
    email: Yup.string()
        .email('must be a valid email format')
        .required('is required'),
    password: Yup.string().required('is required')
});
