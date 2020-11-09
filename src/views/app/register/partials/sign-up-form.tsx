import React from 'react';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { Error, ErrorResponse } from '@modules/api-response';
import { ServerErrors } from '@components/server-error';
import { Button, Input, PasswordStrength, Alert } from '@components/app';
import { Google, AlertError } from '@components/icons';
import { request } from '@modules/request';
import appLogo from '@public/images/logo-sm.svg';
import { registerValidationSchema } from '../validations';

type SignUpFormProps = {
  onSuccess: () => void;
  onLogin: () => void;
  additionalServerErrors?: Error[];
};

const SignUpForm = ({
  onSuccess,
  onLogin,
  additionalServerErrors,
}: SignUpFormProps) => {
  const [serverErrors, setServerErrors] = React.useState<Error[]>([]);

  React.useEffect(() => {
    if (additionalServerErrors && additionalServerErrors.length > 0) {
      setServerErrors(additionalServerErrors);
    }
  }, [additionalServerErrors]);

  const [mutate, { isLoading }] = useMutation(
    (variables: any) => request.post('/api/v1/auth/register', variables),
    {
      onError: (error: AxiosError<ErrorResponse>) => {
        return setServerErrors(error?.response?.data?.error || []);
      },
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      firstName: '',
      email: '',
      password: '',
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      mutate({
        firstName: values.firstName,
        email: values.email,
        password: values.password,
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

  const handleLogin = () => {
    if (onLogin) onLogin();
  };

  return (
    <div className="py-6">
      <div>
        <img src={appLogo} alt="Logo" width="60" className="mb-5" />
      </div>
      <div className="mb-8">
        <h1 className="text-2xl 768:text-3xl font-bold">
          Start your 7-day free trial
        </h1>
      </div>
      <div>
        <Button href="/app/oauth/google" fullWidth>
          <div className="flex items-center justify-center">
            <Google size={32} />
            <span className="ml-2">Sign up with Google</span>
          </div>
        </Button>
      </div>
      <div>
        <div className="flex items-center my-6">
          <div className="border-t border-gray-400 w-full mr-2" />
          <div className="flex-shrink-0 text-sm 768:text-base text-gray-600">
            Or with email
          </div>
          <div className="border-t border-gray-400 w-full ml-2" />
        </div>
      </div>
      <div>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mb-5">
            <label htmlFor="email" className="text-sm 768:text-base">
              <span>First name</span>
              {formik.errors.firstName && formik.touched.firstName ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.firstName}
                </span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  value={formik.values.firstName}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    !!(formik.errors.firstName && formik.touched.firstName)
                  }
                />
              </div>
            </label>
          </div>

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
                  className="mt-1"
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
              <div className="flex items-center justify-between">
                <div>
                  <span>Password</span>
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
              Sign up
            </Button>

            <div className="text-xs 768:text-sm text-gray-500 mt-2">
              By signing up, you agree to our{' '}
              <Link href="/terms-of-service" as="/terms-of-service">
                <a className="text-gray-500 underline visited:text-gray-500">
                  Terms of Service
                </a>
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" as="/privacy-policy">
                <a className="text-gray-500 underline visited:text-gray-500">
                  Privacy Policy
                </a>
              </Link>
              .
            </div>

            <div className="text-sm text-center mt-6">
              <a
                role="button"
                onClick={handleLogin}
                onKeyPress={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
                  if (e.key === 'Enter') handleLogin();
                }}
                tabIndex={0}
              >
                Sign into an existing account
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { SignUpForm };
