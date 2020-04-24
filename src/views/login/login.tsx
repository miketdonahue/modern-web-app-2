import React from 'react';
import { withApollo } from '@apollo-setup/with-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import cx from 'classnames';
import { useServerErrors } from '@components/hooks/use-server-errors';
import { ServerErrors } from '@components/server-error';
import { Button } from '@components/app/button';
import appLogo from '@public/images/logo-sm.svg';
import googleIcon from '@public/images/social/google.svg';
import loginBg from '@public/images/login-bg.jpg';
import { loginValidationSchema } from './validations';
import * as mutations from './graphql/mutations.gql';
import styles from './login.module.scss';

const Login = () => {
  const router = useRouter();
  const [serverErrors, formatServerErrors] = useServerErrors();

  const [loginActor] = useMutation(mutations.loginActor, {
    onCompleted: () => {
      router.push('/');
    },
    onError: (graphQLErrors: any) => {
      return formatServerErrors(graphQLErrors.graphQLErrors);
    },
  });

  const handleGmailButton = () => {
    router.push('/oauth/google');
  };

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      loginActor({
        variables: {
          input: { email: values.email, password: values.password },
        },
      });
    },
  });

  const checkboxStyles = cx(styles.checkbox, 'w-4 h-4 768:w-5 768:h-5');

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.loginGrid}>
          <div>
            <div>
              <img src={appLogo} alt="Logo" width="60" className="mb-5" />
            </div>
            <div>
              <h1 className="text-2xl 768:text-3xl font-bold mb-8">
                Sign in to your account
              </h1>
            </div>
            <div>
              <button
                type="button"
                className="w-full text-sm 768:text-base border shadow-sm border-gray-400 hover:text-gray-900 px-3 py-2 rounded-sm leading-5 768:leading-6"
                onClick={handleGmailButton}
              >
                <div className="flex items-center justify-center">
                  <img src={googleIcon} alt="Google icon" className="w-4 h-4" />
                  <span className="ml-2">Sign in with Google</span>
                </div>
              </button>
            </div>
            <div>
              <div className="flex items-center my-6">
                <div className="border-t border-gray-400 w-full mr-2" />
                <div className="flex-shrink-0 text-sm 768:text-base text-gray-600">
                  Or continue with
                </div>
                <div className="border-t border-gray-400 w-full ml-2" />
              </div>
            </div>
            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="email" className="text-sm 768:text-base">
                    Email
                    <input
                      id="email"
                      type="email"
                      className="block w-full text-sm 768:text-base leading-5 768:leading-6 border border-gray-400 rounded-sm px-3 py-2 mt-2 focus:outline-none focus:shadow-outline"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </label>
                  {formik.errors.email && formik.touched.email ? (
                    <div className="text-red-600 mt-2">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="text-sm 768:text-base">
                    Password
                    <input
                      id="password"
                      type="password"
                      className="block w-full text-sm 768:text-base leading-5 768:leading-6 border border-gray-400 rounded-sm px-3 py-2 mt-2 focus:outline-none focus:shadow-outline"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </label>
                  {formik.errors.password && formik.touched.password ? (
                    <div className="text-red-600 mt-2">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between text-sm 768:text-base my-5">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="remember-me"
                      id="remember-me"
                      className={checkboxStyles}
                    />
                    <span className="ml-2">Remember me</span>
                  </div>

                  <a href="#">Forgot your password?</a>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-700 mb-2">
                    <ServerErrors errors={serverErrors} />
                  </div>

                  <Button>Sign in</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gridRight}>
        <img src={loginBg} alt="Background" className="w-screen h-screen" />
      </div>
    </div>
  );
};

export default withApollo()(Login);
