"use strict";
exports.__esModule = true;
exports.Register = void 0;
var react_1 = require("react");
var link_1 = require("next/link");
var react_query_1 = require("react-query");
var router_1 = require("next/router");
var formik_1 = require("formik");
var server_error_1 = require("@components/server-error");
var app_1 = require("@components/app");
var icons_1 = require("@components/icons");
var request_1 = require("@modules/request");
var logo_sm_svg_1 = require("@public/images/logo-sm.svg");
var register_bg_jpg_1 = require("@public/images/register-bg.jpg");
var validations_1 = require("./validations");
var register_module_scss_1 = require("./register.module.scss");
var Register = function () {
    var router = router_1.useRouter();
    var _a = react_1["default"].useState([]), serverErrors = _a[0], setServerErrors = _a[1];
    var _b = react_query_1.useMutation(function (variables) { return request_1.request.post('/api/v1/auth/register', variables); }, {
        onError: function (error) {
            var _a, _b;
            return setServerErrors(((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || []);
        },
        onSuccess: function () {
            router.push('/app/confirm-email');
        }
    }), mutate = _b[0], isLoading = _b[1].isLoading;
    var formik = formik_1.useFormik({
        validateOnChange: false,
        initialValues: {
            firstName: '',
            email: '',
            password: ''
        },
        validationSchema: validations_1.registerValidationSchema,
        onSubmit: function (values) {
            mutate({
                firstName: values.firstName,
                email: values.email,
                password: values.password
            });
        }
    });
    var handleChange = function (event) {
        var name = event.target.name;
        formik.handleChange(event);
        if (formik.errors[name]) {
            formik.setFieldError(name, '');
        }
    };
    return (<div className={register_module_scss_1["default"].grid}>
      <div className={register_module_scss_1["default"].gridLeft}>
        <div className={register_module_scss_1["default"].registerGrid}>
          <div className="py-6">
            <div>
              <img src={logo_sm_svg_1["default"]} alt="Logo" width="60" className="mb-5"/>
            </div>
            <div className="mb-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Start your 7-day free trial
              </h1>
            </div>
            <div>
              <app_1.Button component="a" href="/app/oauth/google">
                <div className="flex items-center justify-center">
                  <icons_1.Google size={32}/>
                  <span className="ml-2">Sign up with Google</span>
                </div>
              </app_1.Button>
            </div>
            <div>
              <div className="flex items-center my-6">
                <div className="border-t border-gray-400 w-full mr-2"/>
                <div className="flex-shrink-0 text-sm 768:text-base text-gray-600">
                  Or with email
                </div>
                <div className="border-t border-gray-400 w-full ml-2"/>
              </div>
            </div>
            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="email" className="text-sm 768:text-base">
                    <span>First name</span>
                    {formik.errors.firstName && formik.touched.firstName ? (<span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.firstName}
                      </span>) : null}

                    <div className="mt-1">
                      <app_1.Input id="first-name" name="firstName" type="text" value={formik.values.firstName} onChange={handleChange} onBlur={formik.handleBlur} error={!!(formik.errors.firstName && formik.touched.firstName)}/>
                    </div>
                  </label>
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="text-sm 768:text-base">
                    <span>Email address</span>
                    {formik.errors.email && formik.touched.email ? (<span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.email}
                      </span>) : null}

                    <div className="mt-1">
                      <app_1.Input id="email" name="email" type="email" className="mt-1" value={formik.values.email} onChange={handleChange} onBlur={formik.handleBlur} error={!!(formik.errors.email && formik.touched.email)}/>
                    </div>
                  </label>
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="text-sm 768:text-base">
                    <div className="flex items-center justify-between">
                      <div>
                        <span>Password</span>
                        {formik.errors.password && formik.touched.password ? (<span className="text-red-600 mt-1">
                            {' '}
                            {formik.errors.password}
                          </span>) : null}
                      </div>

                      {formik.values.password && (<app_1.PasswordStrength password={formik.values.password}/>)}
                    </div>

                    <div className="mt-1">
                      <app_1.Input.Password id="password" name="password" value={formik.values.password} onChange={handleChange} onBlur={formik.handleBlur} error={!!(formik.errors.password && formik.touched.password)}/>
                    </div>
                  </label>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <server_error_1.ServerErrors errors={serverErrors}/>
                  </div>

                  <app_1.Button type="submit" variant="primary" loading={isLoading}>
                    Sign up
                  </app_1.Button>

                  <div className="text-xs 768:text-sm text-gray-500 mt-2">
                    By signing up, you agree to our{' '}
                    <link_1["default"] href="/terms-of-service" as="/terms-of-service">
                      <a className="text-gray-500 underline visited:text-gray-500">
                        Terms of Service
                      </a>
                    </link_1["default"]>{' '}
                    and{' '}
                    <link_1["default"] href="/privacy-policy" as="/privacy-policy">
                      <a className="text-gray-500 underline visited:text-gray-500">
                        Privacy Policy
                      </a>
                    </link_1["default"]>
                    .
                  </div>

                  <div className="text-sm text-center mt-6">
                    <a href="/app/login">Sign into an existing account</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={register_module_scss_1["default"].gridMiddle}>
        <svg className="absolute h-full w-40 text-white" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="50,0 100,0 50,100 0,100"/>
        </svg>
      </div>
      <div className={register_module_scss_1["default"].gridRight}>
        <img src={register_bg_jpg_1["default"]} alt="Background" className="w-screen h-screen object-cover"/>
      </div>
    </div>);
};
exports.Register = Register;
