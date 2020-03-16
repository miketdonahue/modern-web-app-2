import { withApollo } from '@apollo-setup/with-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useServerErrors } from '@components/hooks/use-server-errors';
import { ServerErrors } from '@components/server-error';
import { Button } from 'react-components';
import { loginValidationSchema } from './validations';
import * as mutations from './graphql/mutations.gql';
import classes from './styles.module.css';

const Login = () => {
  const router = useRouter();
  const [serverErrors, formatServerErrors] = useServerErrors();

  const [loginActor] = useMutation(mutations.loginActor, {
    onCompleted: () => {
      router.push('/');
    },
    onError: (graphQLErrors: any) => {
      return formatServerErrors(graphQLErrors.graphQLErrors);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: values => {
      loginActor({
        variables: {
          input: { email: values.email, password: values.password },
        },
      });
    },
  });

  return (
    <>
      <ServerErrors errors={serverErrors} />
      <Button>Duh</Button>
      <form onSubmit={formik.handleSubmit}>
        <div className={classes.thing}>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
          {formik.errors.email && formik.touched.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>

      <a href="/oauth/google">Login with Google</a>
    </>
  );
};

export default withApollo()(Login);
