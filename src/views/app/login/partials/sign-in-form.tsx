import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { Error } from '@modules/api-response';
import { ServerErrors } from '@components/server-error';
import { Button, Checkbox, Input, Tooltip, Alert } from '@components/app';
import appLogo from '@public/images/logo-sm.svg';
import { Google, AlertError } from '@components/icons';
import { loginValidationSchema } from '../validations';

type SignInForm = {
  onSuccess: () => void;
  onRegister: () => void;
};

const SignInForm = ({ onSuccess, onRegister }: SignInForm) => {
  const [serverErrors, setServerErrors] = useState<Error[]>([]);
  const [rememberMe, setRememberMe] = useState(true);

  const [mutate, { isLoading }] = useMutation(
    (variables: any) => request.post('/api/v1/auth/login', variables),
    {
      onError: (error: AxiosError) => {
        setServerErrors(error?.response?.data?.error || []);
      },
      onSuccess: () => {
        onSuccess();
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;

    formik.handleChange(event);
    setServerErrors([]);

    if ((formik.errors as any)[name]) {
      formik.setFieldError(name, '');
    }
  };

  const handleCreateAccount = () => {
    if (onRegister) onRegister();
  };

  return (
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
        <Button href="/app/oauth/google" fullWidth>
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
                  error={!!(formik.errors.password && formik.touched.password)}
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

            <Link
              href="/app/send-code?type=forgot-password"
              as="/app/send-code?type=forgot-password"
            >
              <a>Forgot your password?</a>
            </Link>
          </div>

          <div className="mt-8">
            {serverErrors.length > 0 && (
              <Alert variant="error" className="mb-4">
                <div className="mr-3">
                  <AlertError size={18} />
                </div>
                <Alert.Content>
                  <ServerErrors errors={serverErrors} />
                </Alert.Content>
              </Alert>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              fullWidth
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>

      <div className="text-sm text-center mt-6">
        <span>Want to sign up?</span>{' '}
        <a
          role="button"
          onClick={handleCreateAccount}
          onKeyPress={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
            if (e.key === 'Enter') handleCreateAccount();
          }}
          tabIndex={0}
        >
          Create a new account
        </a>
      </div>
    </div>
  );
};

export { SignInForm };
