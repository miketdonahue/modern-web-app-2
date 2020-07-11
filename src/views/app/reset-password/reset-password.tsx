import React from 'react';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { Button, Input, PasswordStrength } from '@components/app';
import { ServerErrors } from '@components/server-error';
import { resetPasswordValidationSchema } from './validations';
import styles from './reset-password.module.scss';

const ResetPassword = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = React.useState([]);

  const [mutate, { isLoading }] = useMutation(
    (variables: any) => request.post('/api/v1/auth/login', variables),
    {
      onError: (error: AxiosError) => {
        return setServerErrors(error?.response?.data?.error || []);
      },
      onSuccess: () => {
        router.push('/app');
      },
    }
  );

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      password: '',
      verificationCode: '',
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: (values) => {
      mutate({
        password: values.password,
      });
    },
  });

  const handleChange = (event: any) => {
    formik.handleChange(event);

    if (formik.errors.password) {
      formik.setFieldError('password', '');
    }
  };

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
        <div className={styles.resetPasswordGrid}>
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
                d="m64.448 82.153v-34.679c0-13.806 11.341-25.147 25.146-25.147s25.147 11.341 25.147 25.147v34.679h12.491v-34.679c0-20.709-16.765-37.473-37.474-37.473-20.709 0-37.473 16.764-37.473 37.473v34.679h12.162z"
                fill="#2B3B4E"
              />
              <path
                d="m136.27 156.61h-93.354c-3.2871 0-5.9168-2.629-5.9168-5.917v-65.907c0-3.2871 2.6297-5.9168 5.9168-5.9168h93.354c3.288 0 5.917 2.6297 5.917 5.9168v65.907c0 3.288-2.629 5.917-5.917 5.917z"
                fill="#ECB85E"
              />
              <path
                d="m89.594 99.081c-5.7525 0-10.354 4.6017-10.354 10.355 0 3.944 2.301 7.396 5.4238 9.039v13.149c0 2.63 2.1366 4.766 4.7663 4.766 2.6298 0 4.7664-2.136 4.7664-4.766v-13.149c3.2871-1.808 5.4238-5.095 5.4238-9.039 0.3287-5.753-4.2733-10.355-10.026-10.355z"
                fill="#324A5E"
              />
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Reset your password
              </h1>
              <div className="mt-1">
                Enter a new password and the 8-digit verification code we sent
                to your email address.
              </div>
            </div>

            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="password" className="text-sm 768:text-base">
                    <div className="flex items-center justify-between">
                      <div>
                        <span>New password</span>
                        {formik.errors.password && formik.touched.password ? (
                          <span className="text-red-600 mt-1">
                            {' '}
                            {formik.errors.password}
                          </span>
                        ) : null}
                      </div>

                      {formik.values.password && (
                        <PasswordStrength password={formik.values.password} />
                      )}
                    </div>

                    <div className="mt-1">
                      <Input.Password
                        name="password"
                        value={formik.values.password}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          !!(formik.errors.password && formik.touched.password)
                        }
                      />
                    </div>
                  </label>
                </div>

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
                  <a href="#">I did not receive a code</a>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <ServerErrors errors={serverErrors} />
                  </div>

                  <Button type="submit" variant="primary" loading={isLoading}>
                    Reset my password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gridRight}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 538 768"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0)">
            <rect width="538" height="768" fill="#68D391" />
            <path
              d="M646.504 -172.224L745.903 276.292L307.777 138.116L646.504 -172.224Z"
              fill="white"
              fillOpacity="0.1"
            />
            <rect
              width="20"
              height="20"
              transform="matrix(0.910492 0.413527 -0.413526 0.910492 453.271 535)"
              fill="white"
              fillOpacity="0.1"
            />
            <path
              d="M118 429L124.735 449.729H146.532L128.898 462.541L135.634 483.271L118 470.459L100.366 483.271L107.102 462.541L89.4683 449.729H111.265L118 429Z"
              fill="white"
              fillOpacity="0.1"
            />
            <rect
              x="171.956"
              y="219"
              width="55.55"
              height="20.7855"
              transform="rotate(15.9132 171.956 219)"
              fill="white"
              fillOpacity="0.1"
            />
            <circle cx="169" cy="791" r="127" fill="white" fillOpacity="0.1" />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="538" height="768" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export { ResetPassword };
