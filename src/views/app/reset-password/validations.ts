import * as Yup from 'yup';

export const resetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string().required('is required'),
});
