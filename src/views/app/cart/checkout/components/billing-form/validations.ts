import * as Yup from 'yup';

export const billingFormValidationSchema = Yup.object().shape({
  address: Yup.string().required('is required'),
  address2: Yup.string(),
  city: Yup.string().required('is required'),
  state: Yup.string().required('is required'),
  zip_code: Yup.string().required('is required').length(5, 'must be 5 numbers'),
  country: Yup.string().required('is required'),
});
