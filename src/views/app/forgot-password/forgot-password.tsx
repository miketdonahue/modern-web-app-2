import React from 'react';
import { withApollo } from '@apollo-setup/with-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useServerErrors } from '@components/hooks/use-server-errors';
import { ServerErrors } from '@components/server-error';
import { Button, Input } from '@components/app';
import appLogo from '@public/images/logo-sm.svg';
import loginBg from '@public/images/login-bg.jpg';
import { forgotPasswordValidationSchema } from './validations';
import * as mutations from './graphql/mutations.gql';
import styles from './forgot-password.module.scss';

const ForgotPassword = () => {
  const router = useRouter();
  const [serverErrors, formatServerErrors] = useServerErrors();

  const [loginActor, { loading }] = useMutation(mutations.loginActor, {
    onCompleted: () => {
      router.push('/app');
    },
    onError: (graphQLErrors: any) => {
      return formatServerErrors(graphQLErrors.graphQLErrors);
    },
  });

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: (values) => {
      loginActor({
        variables: {
          input: {
            email: values.email,
          },
        },
      });
    },
  });

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.forgotPasswordGrid}>
          <div className="py-6">
            <div>
              <img src={appLogo} alt="Logo" width="60" className="mb-5" />
            </div>

            <div className="mb-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Forgot your password?
              </h1>
              <div className="mt-1">
                No worries! We will help you reset it and get you back on track.
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

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <ServerErrors errors={serverErrors} />
                  </div>

                  <Button type="submit" variant="primary" loading={loading}>
                    Send reset instructions
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

export default withApollo()(ForgotPassword);
