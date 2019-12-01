import { Fragment } from 'react';
import Router from 'next/router';
import { withFormik } from 'formik';
import { withApollo, compose } from 'react-apollo';
import ServerError from '@components/server-error';
import Form from '@components/antd/form';
import Input from '@components/antd/input';
import Button from '@components/antd/button';
import withServerErrors from '@components/hoc/with-server-errors';
import { loginSchema } from './validations';
import * as mutations from './graphql/mutations.gql';

interface Props {
  client: any;
  formatServerErrors: (array) => void;
}

interface State {
  email: string;
  password: string;
  errors?: any;
}

const LoginView = ({
  values,
  handleChange,
  handleSubmit,
  errors,
  touched,
  serverErrors,
}): any => (
  <Fragment>
    <ServerError errors={serverErrors} />

    <Form onSubmit={handleSubmit}>
      <Form.Item>
        <label htmlFor="email">
          Email
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
        </label>
        {errors.email && touched.email ? <div>{errors.email}</div> : null}
      </Form.Item>
      <Form.Item>
        <label htmlFor="password">
          Password
          <Input
            id="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
        </label>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Login
      </Button>
    </Form>

    <a href="/oauth/google">Login with Google</a>
  </Fragment>
);

export default compose(
  withApollo,
  withServerErrors,
  withFormik<Props, State>({
    displayName: 'LoginForm',
    mapPropsToValues: () => ({
      email: '',
      password: '',
    }),
    validationSchema: loginSchema,
    handleSubmit: (
      values,
      { setSubmitting, props: { client, formatServerErrors } }
    ) => {
      client
        .mutate({
          mutation: mutations.loginActor,
          variables: {
            input: { email: values.email, password: values.password },
          },
        })
        .then(() => {
          Router.push('/');
        })
        .catch(({ graphQLErrors }) => {
          return formatServerErrors(graphQLErrors);
        });
    },
  })
)(LoginView);
