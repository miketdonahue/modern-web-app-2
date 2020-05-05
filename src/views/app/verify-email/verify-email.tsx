import React from 'react';
import { withApollo } from '@apollo-setup/with-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useServerErrors } from '@components/hooks/use-server-errors';
import { ServerErrors } from '@components/server-error';
import { Button, Input } from '@components/app';
import loginBg from '@public/images/login-bg.jpg';
import { verifyEmailValidationSchema } from './validations';
import * as mutations from './graphql/mutations.gql';
import styles from './verify-email.module.scss';

const VerifyEmail = () => {
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
      verificationCode: '',
    },
    validationSchema: verifyEmailValidationSchema,
    onSubmit: (values) => {
      loginActor({
        variables: {
          input: {
            email: values.verificationCode,
          },
        },
      });
    },
  });

  const handleVerificationChange = async (value: string) => {
    formik.setFieldValue('verificationCode', value);

    if (formik.errors.verificationCode) {
      formik.setFieldError('verificationCode', '');
    }
  };

  const handleVerificationComplete = (value: string) => {
    console.log('onComplete', value);
  };

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.forgotPasswordGrid}>
          <div className="py-6">
            <svg
              width="12rem"
              height="12rem"
              className="mx-auto"
              viewBox="0 0 180 180"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m90 180c49.706 0 90-40.294 90-90 0-49.706-40.294-90-90-90-49.706 0-90 40.294-90 90 0 49.706 40.294 90 90 90z"
                fill="#EDF2F7"
              />
              <path
                d="m157.6 57.559-62.471-45.318c-2.2637-1.6543-5.3546-1.6543-7.6618 0l-62.383 45.318 66.258 42.184 66.258-42.184z"
                fill="#ECB85E"
              />
              <path
                d="m132.14 57.559h-81.582v70.742h81.582v-70.742z"
                fill="#fff"
              />
              <path
                d="m157.56 141.88h0.044v-84.324l-66.258 42.184 66.214 42.14z"
                fill="#F3BF64"
              />
              <path
                d="m25.087 57.559h-0.0871v84.324h0.1306l66.214-42.14-66.258-42.184z"
                fill="#F3BF64"
              />
              <path
                d="m91.345 99.743-66.214 42.14h132.43l-66.214-42.14z"
                fill="#ECB85E"
              />
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Verify your email
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
                    formik.touched.verificationCode ? (
                      <span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.verificationCode}
                      </span>
                    ) : null}

                    <div className="mt-1">
                      <Input.VerificationCode
                        name="verificationCode"
                        numOfFields={8}
                        onInputChange={handleVerificationChange}
                        onComplete={handleVerificationComplete}
                        error={
                          !!(
                            formik.errors.verificationCode &&
                            formik.touched.verificationCode
                          )
                        }
                      />
                    </div>
                  </label>
                </div>

                <div className="text-center">
                  <a href="#">Resend code</a>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <ServerErrors errors={serverErrors} />
                  </div>

                  <Button type="submit" variant="primary" loading={loading}>
                    Confirm
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

export default withApollo()(VerifyEmail);
