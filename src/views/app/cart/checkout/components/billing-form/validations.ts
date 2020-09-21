import * as Yup from 'yup';

export const billingFormValidationSchema = Yup.object().shape({
  address_line1: Yup.string().required('is required'),
  address_line2: Yup.string(),
  city: Yup.string().required('is required'),
  state: Yup.string().required('is required'),
  postal_code: Yup.string()
    .required('is required')
    .length(5, 'must be 5 numbers'),
  email: Yup.string().email('must be a valid email').required('is required'),
  name: Yup.string().required('is required'),
});
