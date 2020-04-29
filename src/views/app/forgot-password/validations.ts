import * as Yup from 'yup';

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('must be a valid email format')
    .required('is required'),
});
