import React from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { Button, Input } from '@components/app';
import { forgotPasswordValidationSchema } from './validations';
import styles from './forgot-password.module.scss';

const ForgotPassword = () => {
  const router = useRouter();

  const [mutate, { isLoading }] = useMutation(
    (variables: any) => request.post('/api/v1/auth/forgot-password', variables),
    {
      onSuccess: () => {
        router.push('/app/reset-password');
      },
    }
  );

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordValidationSchema,
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
                d="m98.465 75.469c-0.178 0-0.359-0.0213-0.5396-0.0652-5.1846-1.2699-9.9913-3.8837-13.9-7.5593-0.9098-0.8552-0.9537-2.2865-0.0983-3.196 0.8551-0.9091 2.2865-0.9534 3.1959-0.0983 3.3421 3.1425 7.4495 5.3771 11.878 6.4613 1.2134 0.2969 1.9554 1.521 1.6584 2.7339-0.253 1.0323-1.1769 1.7236-2.1944 1.7236z"
                fill="#5E6B75"
              />
              <path
                d="m103.15 102.9-2.43-6.5915-9.1437-9.4491c-0.1892-0.1715-0.3763-0.3471-0.5588-0.5298-6.0665-6.0666-6.0665-15.903 0-21.97 0.4186-0.4186 0.857-0.8044 1.3086-1.1651l8.8319-7.8553 3.727-7.4247c-7.9868-0.8345-16.268 1.8047-22.388 7.925-0.3542 0.3542-0.6969 0.7158-1.0278 1.0842l-2.5087 0.2512-0.4729 3.7373c-5.5981 9.1043-5.4195 20.755 0.5346 29.698l-48.429 48.428c-2.1297 2.13-2.1297 5.583 0 7.713s5.5831 2.13 7.7128 0l6.4155-6.415 4.8979 4.898c2.1298 2.13 5.5831 2.13 7.7128 0 2.1298-2.13 2.1298-5.583 0-7.713l-4.8979-4.898 5.8658-5.865 4.898 4.897c2.1297 2.13 5.583 2.13 7.7131 0 2.1297-2.129 2.1297-5.583 0-7.712l-4.898-4.898 20.722-20.722c4.9401 3.29 10.707 4.814 16.415 4.576z"
                fill="#F6E080"
              />
              <path
                d="m92.33 63.196c2.6123-2.0855 5.7398-3.2095 8.9079-3.3654l9.751-3.4949 2.646-6.0108c-2.787-1.295-5.746-2.0955-8.746-2.409-5.5731 3.7025-9.9808 9.0175-12.559 15.28z"
                fill="#ECCD61"
              />
              <path
                d="m111.9 101.09-2.068-6.9382-9.654-3.3869c-3.1087-0.366-6.1278-1.6675-8.5997-3.9088 2.1844 6.4423 6.2638 12.01 11.574 16.041 2.973-0.124 5.932-0.726 8.748-1.807z"
                fill="#ECCD61"
              />
              <path
                d="m120.94 163 8.383-4.635v-8.514l-5.745-4.456c-0.778-0.603-0.778-1.778 0-2.382l5.745-4.455-5.745-4.455c-0.778-0.603-0.778-1.778 0-2.382l5.745-4.455-5.745-4.455c-0.778-0.603-0.778-1.779 0-2.382l5.745-4.455v-12.593c0-0.63 0.393-1.193 0.984-1.411 10.528-3.8853 18.036-14.008 18.036-25.885 0-19.182-13.562-26.083-27.52-27.45-14.109 1.3873-25.128 13.526-24.874 27.946 0.2164 12.28 8.4582 22.602 19.704 25.946v54.801l5.287 5.673zm2.754-102.45c4.275 0 7.74 3.4651 7.74 7.7399 0 4.2746-3.465 7.7397-7.74 7.7397-2.219 0-4.221-0.9343-5.632-2.4308l0.121-2.6401-2.128-1.4172c-0.066-0.4073-0.101-0.8256-0.101-1.2519 0-4.2745 3.465-7.7396 7.74-7.7396z"
                fill="#ECB85E"
              />
              <path
                d="m123.53 48.496c-0.916 0-1.821 0.0458-2.713 0.1328 13.96 1.3632 24.871 13.133 24.871 27.451 0 11.878-7.508 22-18.037 25.884-0.591 0.219-0.984 0.781-0.984 1.412v12.593l-5.744 4.455c-0.778 0.603-0.778 1.779 0 2.382l5.744 4.455-5.744 4.455c-0.778 0.604-0.778 1.779 0 2.383l5.744 4.454-5.744 4.456c-0.778 0.603-0.778 1.778 0 2.382l5.744 4.455v7.476l-5.726 5.673 1.545 1.658c0.58 0.622 1.56 0.642 2.164 0.043l6.997-6.932c0.286-0.283 0.447-0.668 0.447-1.071v-6.109c0-0.466-0.216-0.905-0.584-1.191l-5.161-4.002c-0.778-0.604-0.778-1.779 0-2.382l4.209-3.264c0.778-0.604 0.778-1.779 0-2.382l-4.209-3.264c-0.778-0.604-0.778-1.779 0-2.382l4.209-3.264c0.778-0.603 0.778-1.779 0-2.382l-4.209-3.264c-0.778-0.603-0.778-1.779 0-2.382l5.161-4.003c0.368-0.285 0.584-0.725 0.584-1.191v-12.923c11.041-3.6032 19.02-13.983 19.02-26.227 0-15.236-12.35-27.585-27.584-27.585z"
                fill="#EAA949"
              />
              <path
                d="m105.36 14c-17.176 0-31.148 13.973-31.148 31.148 0 5.5846 1.48 10.998 4.2866 15.768 0.8581-1.3956 1.8508-2.7313 2.9805-3.9884-1.8009-3.6435-2.7449-7.6565-2.7449-11.78 0-14.682 11.944-26.626 26.626-26.626 14.682 0 26.626 11.944 26.626 26.626 0 10.653-6.313 20.178-15.928 24.388 0.253 1.5574 0.974 2.9548 2.01 4.0529 11.139-4.9691 18.44-16.051 18.44-28.442-1e-3 -17.174-13.973-31.147-31.148-31.147z"
                fill="#5E6B75"
              />
            </svg>

            <div className="text-center my-8">
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
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.errors.email && formik.touched.email)}
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-8">
                  <Button type="submit" variant="primary" loading={isLoading}>
                    Send reset instructions
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

export { ForgotPassword };
