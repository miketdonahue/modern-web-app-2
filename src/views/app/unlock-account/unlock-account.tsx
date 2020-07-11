import React from 'react';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { request } from '@modules/request';
import { useFormik } from 'formik';
import { ServerErrors } from '@components/server-error';
import { Button, Input } from '@components/app';
import { unlockAccountValidationSchema } from './validations';
import styles from './unlock-account.module.scss';

const UnlockAccount = () => {
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
      email: '',
    },
    validationSchema: unlockAccountValidationSchema,
    onSubmit: (values) => {
      mutate({
        email: values.email,
      });
    },
  });

  const handleChange = (event: any) => {
    const { name } = event.target;

    formik.handleChange(event);

    if ((formik.errors as any)[name]) {
      formik.setFieldError(name, '');
    }
  };

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.unlockAccountGrid}>
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
                d="M64.4476 82.1526V47.4734C64.4476 33.6674 75.7882 22.3268 89.5942 22.3268C103.4 22.3268 114.741 33.6674 114.741 47.4734V50L127.232 47.4734C127.232 26.7644 110.467 10 89.7585 10C69.0496 10 52.2852 26.7644 52.2852 47.4734V82.1526H64.4476Z"
                fill="#2B3B4E"
              />
              <path
                d="M136.271 156.606H42.9168C39.6297 156.606 37 153.977 37 150.689V84.7823C37 81.4952 39.6297 78.8655 42.9168 78.8655H136.271C139.559 78.8655 142.188 81.4952 142.188 84.7823V150.689C142.188 153.977 139.559 156.606 136.271 156.606Z"
                fill="#ECB85E"
              />
              <path
                d="M89.5942 99.0813C83.8417 99.0813 79.2397 103.683 79.2397 109.436C79.2397 113.38 81.5407 116.832 84.6635 118.475V131.624C84.6635 134.254 86.8001 136.39 89.4298 136.39C92.0596 136.39 94.1962 134.254 94.1962 131.624V118.475C97.4833 116.667 99.62 113.38 99.62 109.436C99.9487 103.683 95.3467 99.0813 89.5942 99.0813Z"
                fill="#324A5E"
              />
            </svg>

            <div className="text-center my-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Unlock your account
              </h1>
              <div className="mt-1">
                We&apos;re sorry your account was locked. We may have locked
                your account in order to protect it. Let&apos;s get you back on
                track.
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
                        onChange={handleChange}
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

                  <Button type="submit" variant="primary" loading={isLoading}>
                    Send unlock instructions
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

export { UnlockAccount };
