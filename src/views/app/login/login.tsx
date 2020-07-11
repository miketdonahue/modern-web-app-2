import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { ServerErrors } from '@components/server-error';
import { Button, Checkbox, Input, Tooltip } from '@components/app';
import appLogo from '@public/images/logo-sm.svg';
import { Google } from '@components/icons';
import { loginValidationSchema } from './validations';
import styles from './login.module.scss';

const Login = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState([]);
  const [rememberMe, setRememberMe] = useState(true);

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
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      mutate({
        email: values.email,
        password: values.password,
        rememberMe,
      });
    },
  });

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

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
        <div className={styles.loginGrid}>
          <div className="py-6">
            <div>
              <img src={appLogo} alt="Logo" width="60" className="mb-5" />
            </div>
            <div className="mb-8">
              <h1 className="text-2xl 768:text-3xl font-bold">
                Sign in to your account
              </h1>
            </div>
            <div>
              <Button component="a" href="/app/oauth/google">
                <div className="flex items-center justify-center">
                  <Google size={32} />
                  <span className="ml-2">Sign in with Google</span>
                </div>
              </Button>
            </div>
            <div>
              <div className="flex items-center my-6">
                <div className="border-t border-gray-400 w-full mr-2" />
                <div className="flex-shrink-0 text-sm 768:text-base text-gray-600">
                  Or continue with
                </div>
                <div className="border-t border-gray-400 w-full ml-2" />
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
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          !!(formik.errors.password && formik.touched.password)
                        }
                      />
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between text-sm 768:text-base my-5">
                  <Tooltip
                    content={
                      <div className="text-xs">
                        We will keep you logged in for 14 days
                      </div>
                    }
                  >
                    <div className="flex items-center">
                      <Checkbox
                        id="remember-me"
                        name="remember-me"
                        checked={rememberMe}
                        onChange={handleRememberMe}
                      />
                      <span className="ml-2">Remember me</span>
                    </div>
                  </Tooltip>

                  <Link href="/app/forgot-password" as="/app/forgot-password">
                    <a>Forgot your password?</a>
                  </Link>
                </div>

                <div className="mt-8">
                  <div className="text-sm 768:text-base text-red-600 mb-2">
                    <ServerErrors errors={serverErrors} />
                  </div>

                  <Button type="submit" variant="primary" loading={isLoading}>
                    Sign in
                  </Button>
                </div>
              </form>
            </div>

            <div className="text-sm text-center mt-6">
              <span>Want to sign up?</span>{' '}
              <a href="/app/register">Create a new account</a>
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

export { Login };
