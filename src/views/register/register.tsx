import React from 'react';
import { withApollo } from '@apollo-setup/with-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useServerErrors } from '@components/hooks/use-server-errors';
import { ServerErrors } from '@components/server-error';
import { Button, Input } from '@components/app';
import appLogo from '@public/images/logo-sm.svg';
import googleIcon from '@public/images/social/google.svg';
import registerBg from '@public/images/register-bg.jpg';
import { registerValidationSchema } from './validations';
import * as mutations from './graphql/mutations.gql';
import styles from './register.module.scss';

const Register = () => {
  const router = useRouter();
  const [serverErrors, formatServerErrors] = useServerErrors();

  const [registerActor, { loading }] = useMutation(mutations.registerActor, {
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
      firstName: '',
      email: '',
      password: '',
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      registerActor({
        variables: {
          input: {
            firstName: values.firstName,
            email: values.email,
            password: values.password,
          },
        },
      });
    },
  });

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.registerGrid}>
          <div className="py-6">
            <div>
              <img src={appLogo} alt="Logo" width="60" className="mb-5" />
            </div>
            <div className="mb-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Start your 7-day free trial
              </h1>
            </div>
            <div>
              <Button onClick={handleGmailButton}>
                <div className="flex items-center justify-center">
                  <img src={googleIcon} alt="Google icon" className="w-4 h-4" />
                  <span className="ml-2">Sign up with Google</span>
                </div>
              </Button>
            </div>
            <div>
              <div className="flex items-center my-6">
                <div className="border-t border-gray-400 w-full mr-2" />
                <div className="flex-shrink-0 text-sm 768:text-base text-gray-600">
                  Or with email
                </div>
                <div className="border-t border-gray-400 w-full ml-2" />
              </div>
            </div>
            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="email" className="text-sm 768:text-base">
                    <span>First name</span>
                    {formik.errors.firstName && formik.touched.firstName ? (
                      <span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.firstName}
                      </span>
                    ) : null}

                    <div className="mt-1">
                      <Input
                        id="first-name"
                        name="firstName"
                        type="text"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          !!(
                            formik.errors.firstName && formik.touched.firstName
                          )
                        }
                      />
                    </div>
                  </label>
                </div>

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
                        className="mt-1"
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

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <ServerErrors errors={serverErrors} />
                  </div>

                  <Button type="submit" variant="primary" loading={loading}>
                    Sign up
                  </Button>

                  <div className="text-xs 768:text-sm text-gray-500 mt-2">
                    By signing up, you agree to our{' '}
                    <a href="#" className="text-gray-500 underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-gray-500 underline">
                      Privacy Policy
                    </a>
                    .
                  </div>
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
        <img
          src={registerBg}
          alt="Background"
          className="w-screen h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default withApollo()(Register);
