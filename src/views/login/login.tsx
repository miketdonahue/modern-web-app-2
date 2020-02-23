import { withApollo } from '@apollo-setup/with-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { ServerError } from '@components/server-error';
import { loginValidationSchema } from './validations';
import * as mutations from './graphql/mutations.gql';

// with server errors hoc should be turned into a hook

const Login = () => {
  const router = useRouter();

  const [loginActor, { loading, error, data }] = useMutation(
    mutations.loginActor,
    {
      onCompleted: () => {
        router.push('/');
      },
      // onError: (graphQLErrors: any) => {
      //   return formatServerErrors(graphQLErrors);
      // },
    }
  );

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
      {/* <ServerError errors={serverErrors} /> */}

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </label>
          {/* {errors.email && touched.email ? <div>{errors.email}</div> : null} */}
        </div>
        <div>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
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

// import { Fragment } from 'react';
// import Router from 'next/router';
// import { withFormik } from 'formik';
// import { compose } from 'react-apollo';
// import ServerError from 'src/components/server-error';
// import { Form } from 'src/components/antd/form';
// import { Input } from 'src/components/antd/input';
// import { Button } from 'src/components/antd/button';
// import withServerErrors from 'src/components/hoc/with-server-errors';
// import { loginSchema } from './validations';
// import * as mutations from './graphql/mutations.gql';
// import { withApollo } from '../../client/apollo/with-apollo';

// interface Props {
//   client: any;
//   formatServerErrors: (array) => void;
// }

// interface State {
//   email: string;
//   password: string;
//   errors?: any;
// }

// const LoginView = ({
//   values,
//   handleChange,
//   handleSubmit,
//   errors,
//   touched,
//   serverErrors,
// }): any => (
//   <Fragment>
//     <ServerError errors={serverErrors} />

//     <Form onSubmit={handleSubmit}>
//       <Form.Item>
//         <label htmlFor="email">
//           Email
//           <Input
//             id="email"
//             type="email"
//             value={values.email}
//             onChange={handleChange}
//           />
//         </label>
//         {errors.email && touched.email ? <div>{errors.email}</div> : null}
//       </Form.Item>
//       <Form.Item>
//         <label htmlFor="password">
//           Password
//           <Input
//             id="password"
//             type="password"
//             value={values.password}
//             onChange={handleChange}
//           />
//         </label>
//       </Form.Item>
//       <Button type="primary" htmlType="submit">
//         Login
//       </Button>
//     </Form>

//     <a href="/oauth/google">Login with Google</a>
//   </Fragment>
// );

// export default compose(
//   withApollo,
//   withServerErrors,
//   withFormik<Props, State>({
//     displayName: 'LoginForm',
//     mapPropsToValues: () => ({
//       email: '',
//       password: '',
//     }),
//     validationSchema: loginSchema,
//     handleSubmit: (
//       values,
//       { setSubmitting, props: { client, formatServerErrors } }
//     ) => {
//       client
//         .mutate({
//           mutation: mutations.loginActor,
//           variables: {
//             input: { email: values.email, password: values.password },
//           },
//         })
//         .then(() => {
//           Router.push('/');
//         })
//         .catch(({ graphQLErrors }) => {
//           return formatServerErrors(graphQLErrors);
//         });
//     },
//   })
// )(LoginView);
