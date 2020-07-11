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
exports.ConfirmEmail = void 0;
var react_1 = require("react");
var react_query_1 = require("react-query");
var router_1 = require("next/router");
var formik_1 = require("formik");
var request_1 = require("@modules/request");
var server_error_1 = require("@components/server-error");
var icons_1 = require("@components/icons");
var app_1 = require("@components/app");
var validations_1 = require("./validations");
var confirm_email_module_scss_1 = require("./confirm-email.module.scss");
var ConfirmEmail = function () {
    var router = router_1.useRouter();
    var _a = react_1.useState([]), serverErrors = _a[0], setServerErrors = _a[1];
    var _b = react_query_1.useMutation(function (variables) { return request_1.request.post('/api/v1/auth/confirm', variables); }, {
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
        validationSchema: validations_1.confirmEmailValidationSchema,
        onSubmit: function () { }
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
        /* Intentional timeout to ensure loading state shows for at least 1 second */
        setTimeout(function () {
            mutate({
                code: Number(value)
            });
        }, 1000);
    };
    return (<div className={confirm_email_module_scss_1["default"].grid}>
      <div className={confirm_email_module_scss_1["default"].gridLeft}>
        <div className={confirm_email_module_scss_1["default"].confirmEmailGrid}>
          <div className="py-6">
            <svg width="12rem" height="12rem" className="mx-auto" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
              <path d="m90 180c49.706 0 90-40.294 90-90 0-49.706-40.294-90-90-90-49.706 0-90 40.294-90 90 0 49.706 40.294 90 90 90z" fill="#EDF2F7"/>
              <path d="m157.6 57.559-62.471-45.318c-2.2637-1.6543-5.3546-1.6543-7.6618 0l-62.383 45.318 66.258 42.184 66.258-42.184z" fill="#ECB85E"/>
              <path d="m132.14 57.559h-81.582v70.742h81.582v-70.742z" fill="#fff"/>
              <path d="m157.56 141.88h0.044v-84.324l-66.258 42.184 66.214 42.14z" fill="#F3BF64"/>
              <path d="m25.087 57.559h-0.0871v84.324h0.1306l66.214-42.14-66.258-42.184z" fill="#F3BF64"/>
              <path d="m91.345 99.743-66.214 42.14h132.43l-66.214-42.14z" fill="#ECB85E"/>
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Confirm your email
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
                      <app_1.Input.VerificationCode name="verificationCode" numOfFields={8} onInputChange={handleVerificationChange} onComplete={handleVerificationComplete} disabled={isLoading} error={!!(formik.errors.verificationCode &&
        formik.touched.verificationCode)}/>
                    </div>
                  </label>
                </div>

                <div className="text-center">
                  <a href="#">Resend code</a>
                </div>

                <div className="mt-8">
                  <div className="flex justify-center">
                    <app_1.Spinner size={3} active={isLoading}/>
                  </div>

                  {serverErrors.length > 0 && (<app_1.Alert variant="error">
                      <div className="mr-3">
                        <icons_1.AlertError size={18}/>
                      </div>
                      <app_1.Alert.Content>
                        <app_1.Alert.Header>An error has occurred</app_1.Alert.Header>
                        <server_error_1.ServerErrors errors={serverErrors}/>
                      </app_1.Alert.Content>
                    </app_1.Alert>)}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={confirm_email_module_scss_1["default"].gridRight}>
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
exports.ConfirmEmail = ConfirmEmail;
