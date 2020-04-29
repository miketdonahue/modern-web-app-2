import React, { useState } from 'react';
import Link from 'next/link';
import { withApollo } from '@apollo-setup/with-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useServerErrors } from '@components/hooks/use-server-errors';
import { ServerErrors } from '@components/server-error';
import { Button, Checkbox, Input, Tooltip } from '@components/app';
import appLogo from '@public/images/logo-sm.svg';
import googleIcon from '@public/images/social/google.svg';
import loginBg from '@public/images/login-bg.jpg';
import { loginValidationSchema } from './validations';
import * as mutations from './graphql/mutations.gql';
import styles from './login.module.scss';

const Login = () => {
  const router = useRouter();
  const [serverErrors, formatServerErrors] = useServerErrors();

  const [rememberMe, setRememberMe] = useState(true);

  const [loginActor, { loading }] = useMutation(mutations.loginActor, {
    onCompleted: () => {
      router.push('/app');
    },
    onError: (graphQLErrors: any) => {
      return formatServerErrors(graphQLErrors.graphQLErrors);
    },
  });

  const handleGmailButton = () => {
    router.push('/app/oauth/google');
  };

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
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
          input: {
            email: values.email,
            password: values.password,
            rememberMe,
          },
        },
      });
    },
  });

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.loginGrid}>
          <div className="py-6">
            <div>
              <img src={appLogo} alt="Logo" width="60" className="mb-5" />
            </div>
            <div className="mb-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Sign in to your account
              </h1>
            </div>
            <div>
              <Button onClick={handleGmailButton}>
                <div className="flex items-center justify-center">
                  <img src={googleIcon} alt="Google icon" className="w-4 h-4" />
                  <span className="ml-2">Sign in with Google</span>
                </div>
              </Button>
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
                    <span>Email address</span>
                    {formik.errors.email && formik.touched.email ? (
                      <span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.email}
                      </span>
                    ) : null}

                    <div className="mt-1">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.errors.email && formik.touched.email)}
                      />
                    </div>
                  </label>
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="text-sm 768:text-base">
                    <span>Password</span>
                    {formik.errors.password && formik.touched.password ? (
                      <span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.password}
                      </span>
                    ) : null}

                    <div className="mt-1">
                      <Input.Password
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          !!(formik.errors.password && formik.touched.password)
                        }
                      />
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-sm 768:text-base my-5">
                  <Tooltip
                    content={
                      <div className="text-xs">
                        We will keep you logged in for 14 days
                      </div>
                    }
                  >
                    <div className="flex items-center">
                      <Checkbox
                        id="remember-me"
                        name="remember-me"
                        checked={rememberMe}
                        onChange={handleRememberMe}
                      />
                      <span className="ml-2">Remember me</span>
                    </div>
                  </Tooltip>

                  <Link href="/app/forgot-password" as="/app/forgot-password">
                    Forgot your password?
                  </Link>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <ServerErrors errors={serverErrors} />
                  </div>

                  <Button type="submit" variant="primary" loading={loading}>
                    Sign in
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gridMiddle}>
        <svg
          className="absolute h-full w-40 text-white"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="50,0 100,0 50,100 0,100" />
        </svg>
      </div>
      <div className={styles.gridRight}>
        <img src={loginBg} alt="Background" className="w-screen h-screen" />
      </div>
    </div>
  );
};

export default withApollo()(Login);
