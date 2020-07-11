import React from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { request } from '@modules/request';
import { useFormik } from 'formik';
import { ServerErrors } from '@components/server-error';
import { Button, Input } from '@components/app';
import { verifyAccountValidationSchema } from './validations';
import styles from './verify-account.module.scss';

const VerifyAccount = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = React.useState([]);

  const [mutate, { isLoading }] = useMutation(
    (variables: any) => request.post('/api/v1/auth/login', variables),
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
    validationSchema: verifyAccountValidationSchema,
    onSubmit: (values) => {
      mutate({
        email: values.verificationCode,
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
        <div className={styles.verifyAccountGrid}>
          <div className="py-6">
            <svg
              width="12rem"
              height="12rem"
              className="mx-auto"
              viewBox="0 0 180 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180Z"
                fill="#EDF2F7"
              />
              <path
                d="M90 30L84.605 81.8616L90 168C124.215 149.317 145.499 125.924 145.499 80.791V30H90Z"
                fill="#ECB85E"
              />
              <path
                d="M34.5014 30V80.791C34.5014 125.924 55.7854 149.317 90 168V30H34.5014Z"
                fill="#ECB85E"
              />
              <path
                d="M90 42.938L84.6051 81.8613L90 153.106C103.701 144.919 113.309 136.505 119.952 126.936C128.436 114.714 132.561 99.6204 132.561 80.791V42.938H90Z"
                fill="#F6E080"
              />
              <path
                d="M47.4394 42.938V80.791C47.4394 99.6204 51.5638 114.714 60.0483 126.936C66.6912 136.505 76.2994 144.919 90 153.106V42.938H47.4394Z"
                fill="#F6E080"
              />
              <path
                d="M90 63.6863L84.605 81.8616L90 117.047H98.7996V92.9202C103.103 90.0653 105.942 85.1792 105.942 79.628C105.942 70.8237 98.8045 63.6863 90 63.6863Z"
                fill="#324A5E"
              />
              <path
                d="M74.058 79.6282C74.058 85.1795 76.897 90.0656 81.2004 92.9204V117.048H90V63.6863C81.1955 63.6863 74.058 70.8237 74.058 79.6282Z"
                fill="#324A5E"
              />
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Verify your account
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

                  <Button type="submit" variant="primary" loading={isLoading}>
                    Verify my account
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

export { VerifyAccount };
