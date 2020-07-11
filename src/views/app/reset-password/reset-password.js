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
exports.ResetPassword = void 0;
var react_1 = require("react");
var react_query_1 = require("react-query");
var router_1 = require("next/router");
var formik_1 = require("formik");
var request_1 = require("@modules/request");
var app_1 = require("@components/app");
var server_error_1 = require("@components/server-error");
var validations_1 = require("./validations");
var reset_password_module_scss_1 = require("./reset-password.module.scss");
var ResetPassword = function () {
    var router = router_1.useRouter();
    var _a = react_1["default"].useState([]), serverErrors = _a[0], setServerErrors = _a[1];
    var _b = react_query_1.useMutation(function (variables) { return request_1.request.post('/api/v1/auth/login', variables); }, {
        onError: function (error) {
            var _a, _b;
            return setServerErrors(((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || []);
        },
        onSuccess: function () {
            router.push('/app');
        }
    }), mutate = _b[0], isLoading = _b[1].isLoading;
    var formik = formik_1.useFormik({
        validateOnChange: false,
        initialValues: {
            password: '',
            verificationCode: ''
        },
        validationSchema: validations_1.resetPasswordValidationSchema,
        onSubmit: function (values) {
            mutate({
                password: values.password
            });
        }
    });
    var handleChange = function (event) {
        formik.handleChange(event);
        if (formik.errors.password) {
            formik.setFieldError('password', '');
        }
    };
    var handleVerificationChange = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            formik.setFieldValue('verificationCode', value);
            if (formik.errors.verificationCode) {
                formik.setFieldError('verificationCode', '');
            }
            return [2 /*return*/];
        });
    }); };
    var handleVerificationComplete = function (value) {
        console.log('onComplete', value);
    };
    return (<div className={reset_password_module_scss_1["default"].grid}>
      <div className={reset_password_module_scss_1["default"].gridLeft}>
        <div className={reset_password_module_scss_1["default"].resetPasswordGrid}>
          <div className="py-6">
            <svg width="12rem" height="12rem" className="mx-auto" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
              <path d="m90 180c49.706 0 90-40.294 90-90 0-49.706-40.294-90-90-90-49.706 0-90 40.294-90 90 0 49.706 40.294 90 90 90z" fill="#EDF2F7"/>
              <path d="m64.448 82.153v-34.679c0-13.806 11.341-25.147 25.146-25.147s25.147 11.341 25.147 25.147v34.679h12.491v-34.679c0-20.709-16.765-37.473-37.474-37.473-20.709 0-37.473 16.764-37.473 37.473v34.679h12.162z" fill="#2B3B4E"/>
              <path d="m136.27 156.61h-93.354c-3.2871 0-5.9168-2.629-5.9168-5.917v-65.907c0-3.2871 2.6297-5.9168 5.9168-5.9168h93.354c3.288 0 5.917 2.6297 5.917 5.9168v65.907c0 3.288-2.629 5.917-5.917 5.917z" fill="#ECB85E"/>
              <path d="m89.594 99.081c-5.7525 0-10.354 4.6017-10.354 10.355 0 3.944 2.301 7.396 5.4238 9.039v13.149c0 2.63 2.1366 4.766 4.7663 4.766 2.6298 0 4.7664-2.136 4.7664-4.766v-13.149c3.2871-1.808 5.4238-5.095 5.4238-9.039 0.3287-5.753-4.2733-10.355-10.026-10.355z" fill="#324A5E"/>
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Reset your password
              </h1>
              <div className="mt-1">
                Enter a new password and the 8-digit verification code we sent
                to your email address.
              </div>
            </div>

            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="password" className="text-sm 768:text-base">
                    <div className="flex items-center justify-between">
                      <div>
                        <span>New password</span>
                        {formik.errors.password && formik.touched.password ? (<span className="text-red-600 mt-1">
                            {' '}
                            {formik.errors.password}
                          </span>) : null}
                      </div>

                      {formik.values.password && (<app_1.PasswordStrength password={formik.values.password}/>)}
                    </div>

                    <div className="mt-1">
                      <app_1.Input.Password name="password" value={formik.values.password} onChange={handleChange} onBlur={formik.handleBlur} error={!!(formik.errors.password && formik.touched.password)}/>
                    </div>
                  </label>
                </div>

                <div className="mb-2">
                  <label htmlFor="password" className="text-sm 768:text-base">
                    <span>Verification code</span>
                    {formik.errors.verificationCode &&
        formik.touched.verificationCode ? (<span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.verificationCode}
                      </span>) : null}

                    <div className="mt-1">
                      <app_1.Input.VerificationCode name="verificationCode" numOfFields={8} onInputChange={handleVerificationChange} onComplete={handleVerificationComplete} error={!!(formik.errors.verificationCode &&
        formik.touched.verificationCode)}/>
                    </div>
                  </label>
                </div>

                <div className="text-center">
                  <a href="#">I did not receive a code</a>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <server_error_1.ServerErrors errors={serverErrors}/>
                  </div>

                  <app_1.Button type="submit" variant="primary" loading={isLoading}>
                    Reset my password
                  </app_1.Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={reset_password_module_scss_1["default"].gridRight}>
        <svg width="100%" height="100%" viewBox="0 0 538 768" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0)">
            <rect width="538" height="768" fill="#68D391"/>
            <path d="M646.504 -172.224L745.903 276.292L307.777 138.116L646.504 -172.224Z" fill="white" fillOpacity="0.1"/>
            <rect width="20" height="20" transform="matrix(0.910492 0.413527 -0.413526 0.910492 453.271 535)" fill="white" fillOpacity="0.1"/>
            <path d="M118 429L124.735 449.729H146.532L128.898 462.541L135.634 483.271L118 470.459L100.366 483.271L107.102 462.541L89.4683 449.729H111.265L118 429Z" fill="white" fillOpacity="0.1"/>
            <rect x="171.956" y="219" width="55.55" height="20.7855" transform="rotate(15.9132 171.956 219)" fill="white" fillOpacity="0.1"/>
            <circle cx="169" cy="791" r="127" fill="white" fillOpacity="0.1"/>
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="538" height="768" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>);
};
exports.ResetPassword = ResetPassword;
