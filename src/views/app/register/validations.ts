import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('is required'),
  email: Yup.string()
    .email('must be a valid email format')
    .required('is required'),
  password: Yup.string().required('is required'),
});
