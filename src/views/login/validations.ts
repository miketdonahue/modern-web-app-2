import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address format')
    .required('An email address is required'),
  password: Yup.string().required('A password is required'),
});
