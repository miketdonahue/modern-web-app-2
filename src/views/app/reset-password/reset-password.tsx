import React from 'react';
import { withApollo } from '@apollo-setup/with-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { Button, Input } from '@components/app';
import { useServerErrors } from '@components/hooks/use-server-errors';
import { ServerErrors } from '@components/server-error';
import appLogo from '@public/images/logo-sm.svg';
import loginBg from '@public/images/login-bg.jpg';
import { resetPasswordValidationSchema } from './validations';
import * as mutations from './graphql/mutations.gql';
import styles from './reset-password.module.scss';

const ResetPassword = () => {
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
      password: '',
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: (values) => {
      loginActor({
        variables: {
          input: {
            password: values.password,
          },
        },
      });
    },
  });

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.resetPasswordGrid}>
          <div className="py-6">
            <div>
              <img src={appLogo} alt="Logo" width="60" className="mb-5" />
            </div>

            <div className="mb-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Reset your password
              </h1>
              <div className="mt-1">
                Enter a new password that you will use to log in.
              </div>
            </div>

            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
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
                    Reset my password
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

export default withApollo()(ResetPassword);
