import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { ServerErrors } from '@components/server-error';
import { AlertError } from '@components/icons';
import { Input, Spinner, Alert } from '@components/app';
import { confirmEmailValidationSchema } from './validations';
import styles from './confirm-email.module.scss';

const ConfirmEmail = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState([]);

  const [mutate, { isLoading }] = useMutation(
    (variables: any) => request.post('/api/v1/auth/confirm', variables),
    {
      onError: (error) => {
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
      verificationCode: '',
    },
    validationSchema: confirmEmailValidationSchema,
    onSubmit: () => {},
  });

  const handleVerificationChange = async (value: string) => {
    formik.setFieldValue('verificationCode', value);

    if (formik.errors.verificationCode) {
      formik.setFieldError('verificationCode', '');
    }
  };

  const handleVerificationComplete = (value: string) => {
    /* Intentional timeout to ensure loading state shows for at least 1 second */
    setTimeout(() => {
      mutate({
        code: Number(value),
      });
    }, 1000);
  };

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.confirmEmailGrid}>
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
                        disabled={isLoading}
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
                  <div className="flex justify-center">
                    <Spinner size={3} active={isLoading} />
                  </div>

                  {serverErrors.length > 0 && (
                    <Alert variant="error">
                      <div className="mr-3">
                        <AlertError size={18} />
                      </div>
                      <Alert.Content>
                        <Alert.Header>An error has occurred</Alert.Header>
                        <ServerErrors errors={serverErrors} />
                      </Alert.Content>
                    </Alert>
                  )}
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

export { ConfirmEmail };
