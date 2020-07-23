import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { ServerErrors } from '@components/server-error';
import { AlertError } from '@components/icons';
import { Email, Keys, LockOpen } from '@components/illustrations';
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
        if (router.query.type === 'forgot-password') {
          router.push('/app/reset-password');
        } else {
          router.push(`/app/security-code?type=${router.query.type}`);
        }
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

  const getIllustration = (type: string) => {
    switch (type) {
      case 'confirm-email':
        return <Email size={196} className="mx-auto" />;
      case 'forgot-password':
        return <Keys size={196} className="mx-auto" />;
      case 'unlock-account':
        return <LockOpen size={196} className="mx-auto" />;
      default:
        break;
    }

    return '';
  };

  const getHeadingText = (type: string) => {
    switch (type) {
      case 'confirm-email':
        return 'Confirm your email';
      case 'forgot-password':
        return 'Forgot your password?';
      case 'unlock-account':
        return 'Unlock your account';
      default:
        break;
    }

    return '';
  };

  const getDescriptionText = (type: string) => {
    switch (type) {
      case 'confirm-email':
        return 'confirm your email';
      case 'forgot-password':
        return 'reset your password';
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
        <div className={styles.sendCodeGrid}>
          <div className="py-6">
            {getIllustration(router.query.type as string)}

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                {getHeadingText(router.query.type as string)}
              </h1>

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
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    fullWidth
                  >
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
