import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('must be a valid email format')
    .required('is required'),
  password: Yup.string().required('is required'),
});
