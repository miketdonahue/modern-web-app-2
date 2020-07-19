import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { Error } from '@server/modules/api-response';
import { ServerErrors } from '@components/server-error';
import { AlertError, AlertInfo } from '@components/icons';
import { Input, Spinner, Alert } from '@components/app';
import { securityCodeValidationSchema } from './validations';
import styles from './security-code.module.scss';

const SecurityCode = () => {
  const router = useRouter();
  const [infoAlerts, setInfoAlerts] = useState<string[]>([]);
  const [serverErrors, setServerErrors] = useState<Error[]>([]);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      code: '',
    },
    validationSchema: securityCodeValidationSchema,
    onSubmit: () => {},
  });

  const [mutate, { isLoading }] = useMutation(
    (variables: any) => request.post('/api/v1/auth/security-code', variables),
    {
      onError: (error: AxiosError) => {
        return error?.response?.data?.error.map((e: Error) => {
          if (e.code === 'CODE_EXPIRED') {
            formik.setFieldValue('code', '');
            setInfoAlerts([...infoAlerts, e.detail || '']);
          } else {
            setServerErrors([...serverErrors, e]);
          }
        });
      },
      onSuccess: () => {
        router.push('/app/login');
      },
    }
  );

  const handleVerificationChange = async (value: string) => {
    formik.setFieldValue('code', value);

    setInfoAlerts([]);
    setServerErrors([]);

    if (formik.errors.code) {
      formik.setFieldError('code', '');
    }
  };

  const handleVerificationComplete = (value: string) => {
    /* Intentional timeout to ensure loading state shows for at least 1 second */
    setTimeout(() => {
      mutate({
        type: router.query.type,
        code: value,
      });
    }, 1000);
  };

  const getDescriptionText = (type: string) => {
    switch (type) {
      case 'confirm-email':
        return 'confirm your email';
      case 'unlock-account':
        return 'unlock your account';
      default:
        break;
    }

    return '';
  };

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.securityCodeGrid}>
          <div className="py-6">
            <svg
              width="12rem"
              height="12rem"
              className="mx-auto"
              viewBox="0 0 180 180"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180Z"
                fill="#EDF2F7"
              />
              <path
                d="M90 20C51.4005 20 20 51.4005 20 90C20 128.6 51.4005 160 90 160C128.6 160 160 128.6 160 90C160 51.4005 128.6 20 90 20Z"
                fill="#F6E080"
              />
              <path
                d="M129.916 71.925L83.7214 118.127C82.3355 119.513 80.5163 120.211 78.697 120.211C76.8778 120.211 75.0586 119.513 73.6727 118.127L50.5759 95.0259C47.7963 92.2472 47.7963 87.7543 50.5759 84.9755C53.3542 82.1954 57.845 82.1954 60.6245 84.9755L78.697 103.051L119.868 61.8746C122.646 59.0945 127.137 59.0945 129.916 61.8746C132.695 64.6534 132.695 69.145 129.916 71.925V71.925Z"
                fill="#ECB85E"
              />
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Enter security code
              </h1>
              <div className="mt-1">
                We sent an 8-digit code to your email address to{' '}
                {getDescriptionText(router.query.type as string)}. Please enter
                the code below.
              </div>
            </div>

            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-2">
                  <label htmlFor="password" className="text-sm 768:text-base">
                    <span>Security code</span>
                    {formik.errors.code && formik.touched.code ? (
                      <span className="text-red-600 mt-1">
                        {' '}
                        {formik.errors.code}
                      </span>
                    ) : null}

                    <div className="mt-1">
                      <Input.VerificationCode
                        name="code"
                        numOfFields={8}
                        onInputChange={handleVerificationChange}
                        onComplete={handleVerificationComplete}
                        values={() => {
                          const codeValues = Array.from(formik.values.code);

                          const remainingValues = 8 - codeValues.length;

                          return codeValues.concat(
                            new Array(remainingValues).fill('')
                          );
                        }}
                        disabled={isLoading}
                        error={!!(formik.errors.code && formik.touched.code)}
                      />
                    </div>
                  </label>
                </div>

                <div className="text-center">
                  <a href={`/app/send-code?type=${router.query.type}`}>
                    Resend code
                  </a>
                </div>

                <div className="mt-8">
                  <div className="flex justify-center">
                    <Spinner size={3} active={isLoading} />
                  </div>

                  {infoAlerts.length > 0 && (
                    <Alert variant="info">
                      <div className="mr-3">
                        <AlertInfo size={18} />
                      </div>
                      <Alert.Content>
                        {infoAlerts.map((message: string) => {
                          return <span key={uuid()}>{message}</span>;
                        })}
                      </Alert.Content>
                    </Alert>
                  )}

                  {serverErrors.length > 0 && (
                    <Alert variant="error">
                      <div className="mr-3">
                        <AlertError size={18} />
                      </div>
                      <Alert.Content>
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

export { SecurityCode };
