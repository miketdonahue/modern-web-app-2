import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { ServerErrors } from '@components/server-error';
import { AlertError } from '@components/icons';
import { Input, Spinner, Alert, Button } from '@components/app';
import { sendCodeValidationSchema } from './validations';
import styles from './send-code.module.scss';

const SendCode = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState([]);

  const [mutate, { isLoading }] = useMutation(
    (variables: any) => request.post('/api/v1/auth/send-code', variables),
    {
      onError: (error: AxiosError) => {
        return setServerErrors(error?.response?.data?.error || []);
      },
      onSuccess: () => {
        router.push(`/app/security-code?type=${router.query.type}`);
      },
    }
  );

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      email: '',
    },
    validationSchema: sendCodeValidationSchema,
    onSubmit: (values) => {
      mutate({
        type: router.query.type,
        email: values.email,
      });
    },
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event);

    if (formik.errors.email) {
      formik.setFieldError('email', '');
    }
  };

  const getDescriptionText = (type: string) => {
    switch (type) {
      case 'confirm-email':
        return 'confirm your email';
      default:
        break;
    }

    return '';
  };

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.sendCodeGrid}>
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
                d="M96.4642 105.969L76.7515 130.212L109.152 111.406L96.4642 105.969Z"
                fill="#ECB85E"
              />
              <path
                d="M140.493 33.0267C139.471 32.2872 138.13 32.1349 136.948 32.6352L42.6985 76.1349C41.3862 76.6932 40.5235 77.9764 40.5017 79.4119C40.4872 80.8401 41.3065 82.1524 42.6115 82.7541L129.611 126.254C130.089 126.471 130.611 126.587 131.126 126.587C131.757 126.587 132.388 126.428 132.953 126.094C133.975 125.5 134.635 124.441 134.737 123.267L141.987 36.2674C142.095 34.9987 141.53 33.7662 140.493 33.0267Z"
                fill="#ECB85E"
              />
              <path
                d="M68.8055 144.226C67.457 144.226 66.1665 143.472 65.5358 142.182C64.6658 140.377 65.4198 138.209 67.2178 137.339C69.0303 136.462 69.9075 135.758 70.067 135.584C70.763 133.707 72.677 133.069 74.5475 133.75C76.4252 134.446 77.2155 136.846 76.5195 138.724C76.2802 139.383 75.5407 141.37 70.3715 143.871C69.8713 144.11 69.3348 144.226 68.8055 144.226Z"
                fill="#ECB85E"
              />
              <path
                d="M54.0881 147.656H53.8271C49.3612 147.656 45.2069 146.786 41.4732 145.067C39.6535 144.226 38.8632 142.073 39.697 140.261C40.538 138.441 42.6912 137.658 44.511 138.485C47.2804 139.768 50.4124 140.413 53.8271 140.413C55.8281 140.413 57.5826 142.037 57.5826 144.038C57.5826 146.039 56.0891 147.656 54.0881 147.656Z"
                fill="#ECB85E"
              />
              <path
                d="M32.0265 135.106C30.7868 135.106 29.5833 134.468 28.9018 133.33C27.9448 131.713 27.0603 129.922 26.2628 127.95C25.5161 126.087 26.415 123.977 28.271 123.231C30.1053 122.491 32.244 123.383 32.9908 125.232C33.6433 126.856 34.361 128.32 35.144 129.632C36.1662 131.358 35.5935 133.584 33.8753 134.606C33.288 134.939 32.65 135.106 32.0265 135.106Z"
                fill="#ECB85E"
              />
              <path
                d="M138.376 35.9629L76.7515 101.858V130.212L95.1519 110.355L138.376 35.9629Z"
                fill="#F6E080"
              />
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">Resend Code</h1>
              <div className="mt-1">
                Please enter your email address and we will send you a code to{' '}
                {getDescriptionText(router.query.type as string)}.
              </div>
            </div>

            <div>
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-2">
                  <label htmlFor="password" className="text-sm 768:text-base">
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
                        onChange={handleEmailChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.errors.email && formik.touched.email)}
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-8">
                  <Button type="submit" variant="primary" loading={isLoading}>
                    Send code
                  </Button>
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

export { SendCode };
