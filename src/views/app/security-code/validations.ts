import * as Yup from 'yup';

export const securityCodeValidationSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .min(8, 'is an 8-digit number')
    .max(8, 'is an 8-digit number')
    .matches(/^[0-9]+$/g, 'is an 8-digit number')
    .required('is required'),
});
