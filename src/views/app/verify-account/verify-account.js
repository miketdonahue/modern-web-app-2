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
exports.VerifyAccount = void 0;
var react_1 = require("react");
var react_query_1 = require("react-query");
var router_1 = require("next/router");
var request_1 = require("@modules/request");
var formik_1 = require("formik");
var server_error_1 = require("@components/server-error");
var app_1 = require("@components/app");
var validations_1 = require("./validations");
var verify_account_module_scss_1 = require("./verify-account.module.scss");
var VerifyAccount = function () {
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
            verificationCode: ''
        },
        validationSchema: validations_1.verifyAccountValidationSchema,
        onSubmit: function (values) {
            mutate({
                email: values.verificationCode
            });
        }
    });
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
    return (<div className={verify_account_module_scss_1["default"].grid}>
      <div className={verify_account_module_scss_1["default"].gridLeft}>
        <div className={verify_account_module_scss_1["default"].verifyAccountGrid}>
          <div className="py-6">
            <svg width="12rem" height="12rem" className="mx-auto" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180Z" fill="#EDF2F7"/>
              <path d="M90 30L84.605 81.8616L90 168C124.215 149.317 145.499 125.924 145.499 80.791V30H90Z" fill="#ECB85E"/>
              <path d="M34.5014 30V80.791C34.5014 125.924 55.7854 149.317 90 168V30H34.5014Z" fill="#ECB85E"/>
              <path d="M90 42.938L84.6051 81.8613L90 153.106C103.701 144.919 113.309 136.505 119.952 126.936C128.436 114.714 132.561 99.6204 132.561 80.791V42.938H90Z" fill="#F6E080"/>
              <path d="M47.4394 42.938V80.791C47.4394 99.6204 51.5638 114.714 60.0483 126.936C66.6912 136.505 76.2994 144.919 90 153.106V42.938H47.4394Z" fill="#F6E080"/>
              <path d="M90 63.6863L84.605 81.8616L90 117.047H98.7996V92.9202C103.103 90.0653 105.942 85.1792 105.942 79.628C105.942 70.8237 98.8045 63.6863 90 63.6863Z" fill="#324A5E"/>
              <path d="M74.058 79.6282C74.058 85.1795 76.897 90.0656 81.2004 92.9204V117.048H90V63.6863C81.1955 63.6863 74.058 70.8237 74.058 79.6282Z" fill="#324A5E"/>
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Verify your account
              </h1>
              <div className="mt-1">
                We sent an 8-digit code to your email address. Please enter the
                code below.
              </div>
            </div>

            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
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
                  <a href="#">Resend code</a>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <server_error_1.ServerErrors errors={serverErrors}/>
                  </div>

                  <app_1.Button type="submit" variant="primary" loading={isLoading}>
                    Verify my account
                  </app_1.Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={verify_account_module_scss_1["default"].gridRight}>
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
exports.VerifyAccount = VerifyAccount;
