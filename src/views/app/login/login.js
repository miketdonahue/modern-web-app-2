"use strict";
exports.__esModule = true;
exports.Login = void 0;
var react_1 = require("react");
var link_1 = require("next/link");
var react_query_1 = require("react-query");
var router_1 = require("next/router");
var formik_1 = require("formik");
var request_1 = require("@modules/request");
var server_error_1 = require("@components/server-error");
var app_1 = require("@components/app");
var logo_sm_svg_1 = require("@public/images/logo-sm.svg");
var icons_1 = require("@components/icons");
var validations_1 = require("./validations");
var login_module_scss_1 = require("./login.module.scss");
var Login = function () {
    var router = router_1.useRouter();
    var _a = react_1.useState([]), serverErrors = _a[0], setServerErrors = _a[1];
    var _b = react_1.useState(true), rememberMe = _b[0], setRememberMe = _b[1];
    var _c = react_query_1.useMutation(function (variables) { return request_1.request.post('/api/v1/auth/login', variables); }, {
        onError: function (error) {
            var _a, _b;
            return setServerErrors(((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || []);
        },
        onSuccess: function () {
            router.push('/app');
        }
    }), mutate = _c[0], isLoading = _c[1].isLoading;
    var formik = formik_1.useFormik({
        validateOnChange: false,
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validations_1.loginValidationSchema,
        onSubmit: function (values) {
            mutate({
                email: values.email,
                password: values.password,
                rememberMe: rememberMe
            });
        }
    });
    var handleRememberMe = function (event) {
        setRememberMe(event.target.checked);
    };
    var handleChange = function (event) {
        var name = event.target.name;
        formik.handleChange(event);
        if (formik.errors[name]) {
            formik.setFieldError(name, '');
        }
    };
    return (<div className={login_module_scss_1["default"].grid}>
      <div className={login_module_scss_1["default"].gridLeft}>
        <div className={login_module_scss_1["default"].loginGrid}>
          <div className="py-6">
            <div>
              <img src={logo_sm_svg_1["default"]} alt="Logo" width="60" className="mb-5"/>
            </div>
            <div className="mb-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Sign in to your account
              </h1>
            </div>
            <div>
              <app_1.Button component="a" href="/app/oauth/google">
                <div className="flex items-center justify-center">
                  <icons_1.Google size={32}/>
                  <span className="ml-2">Sign in with Google</span>
                </div>
              </app_1.Button>
            </div>
            <div>
              <div className="flex items-center my-6">
                <div className="border-t border-gray-400 w-full mr-2"/>
                <div className="flex-shrink-0 text-sm 768:text-base text-gray-600">
                  Or continue with
                </div>
                <div className="border-t border-gray-400 w-full ml-2"/>
              </div>
            </div>
            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="email" className="text-sm 768:text-base">
                    <span>Email address</span>
                    {formik.errors.email && formik.touched.email ? (<span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.email}
                      </span>) : null}

                    <div className="mt-1">
                      <app_1.Input id="email" name="email" type="email" value={formik.values.email} onChange={handleChange} onBlur={formik.handleBlur} error={!!(formik.errors.email && formik.touched.email)}/>
                    </div>
                  </label>
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="text-sm 768:text-base">
                    <span>Password</span>
                    {formik.errors.password && formik.touched.password ? (<span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.password}
                      </span>) : null}

                    <div className="mt-1">
                      <app_1.Input.Password id="password" name="password" value={formik.values.password} onChange={handleChange} onBlur={formik.handleBlur} error={!!(formik.errors.password && formik.touched.password)}/>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-sm 768:text-base my-5">
                  <app_1.Tooltip content={<div className="text-xs">
                        We will keep you logged in for 14 days
                      </div>}>
                    <div className="flex items-center">
                      <app_1.Checkbox id="remember-me" name="remember-me" checked={rememberMe} onChange={handleRememberMe}/>
                      <span className="ml-2">Remember me</span>
                    </div>
                  </app_1.Tooltip>

                  <link_1["default"] href="/app/forgot-password" as="/app/forgot-password">
                    <a>Forgot your password?</a>
                  </link_1["default"]>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <server_error_1.ServerErrors errors={serverErrors}/>
                  </div>

                  <app_1.Button type="submit" variant="primary" loading={isLoading}>
                    Sign in
                  </app_1.Button>
                </div>
              </form>
            </div>

            <div className="text-sm text-center mt-6">
              <span>Want to sign up?</span>{' '}
              <a href="/app/register">Create a new account</a>
            </div>
          </div>
        </div>
      </div>
      <div className={login_module_scss_1["default"].gridRight}>
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
exports.Login = Login;
