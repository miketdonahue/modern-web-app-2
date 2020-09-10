import React from 'react';
import { useMutation } from 'react-query';
import { useFormik } from 'formik';
import { request } from '@modules/request';
import { Input, Button, Select } from '@components/app';
import { states } from '@modules/data/states';
import { countries } from '@modules/data/countries';
import { billingFormValidationSchema } from './validations';

type BillingForm = {
  onSuccess: () => void;
};

export const BillingForm = ({ onSuccess }: BillingForm) => {
  // const [serverErrors, setServerErrors] = React.useState<Error[]>([]);

  const [createCustomer] = useMutation(
    (values: any) => request.post('/api/v1/customers', values),
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  const formik = useFormik({
    validateOnChange: false,
    validateOnMount: true,
    initialValues: {
      address: '',
      address2: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
    },
    validationSchema: billingFormValidationSchema,
    onSubmit: (values) => {
      createCustomer({ values });
    },
  });

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name } = event.target;

    formik.handleChange(event);
    // setServerErrors([]);

    if ((formik.errors as any)[name]) {
      formik.setFieldError(name, undefined);
      formik.validateForm(formik.values);
    }
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="text-sm 768:text-base">
              <span>Address</span>
              {formik.errors.address && formik.touched.address ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.address}
                </span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formik.values.address}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.errors.address && formik.touched.address)}
                />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="address2" className="text-sm 768:text-base">
              <span>Address 2</span>
              {formik.errors.address2 && formik.touched.address2 ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.address2}
                </span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="address2"
                  name="address2"
                  type="text"
                  value={formik.values.address2}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.errors.address2 && formik.touched.address2)}
                />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="city" className="text-sm 768:text-base">
              <span>City</span>
              {formik.errors.city && formik.touched.city ? (
                <span className="text-red-600 mt-1"> {formik.errors.city}</span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formik.values.city}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.errors.city && formik.touched.city)}
                />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="state" className="text-sm 768:text-base">
              <span>State</span>
              {formik.errors.state && formik.touched.state ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.state}
                </span>
              ) : null}

              <div className="mt-1">
                <Select
                  id="state"
                  menuId="state"
                  name="state"
                  placeholder="Select your state"
                  items={states}
                  value={formik.values.state}
                  onSelection={(selected: string | null) => {
                    formik.setFieldValue('state', selected);
                    formik.setFieldError('state', undefined);
                  }}
                  error={!!(formik.errors.state && formik.touched.state)}
                >
                  {(item) => {
                    return <span>{item}</span>;
                  }}
                </Select>
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="zip_code" className="text-sm 768:text-base">
              <span>Zip code</span>
              {formik.errors.zip_code && formik.touched.zip_code ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.zip_code}
                </span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="zip_code"
                  name="zip_code"
                  type="text"
                  value={formik.values.zip_code}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.errors.zip_code && formik.touched.zip_code)}
                />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="state" className="text-sm 768:text-base">
              <span>Country</span>
              {formik.errors.country && formik.touched.country ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.country}
                </span>
              ) : null}

              <div className="mt-1">
                <Select
                  id="country"
                  menuId="country"
                  name="country"
                  placeholder="Select your country"
                  items={countries}
                  value={formik.values.country}
                  onSelection={(selected: string | null) => {
                    formik.setFieldValue('country', selected);
                    formik.setFieldError('country', undefined);
                  }}
                  error={!!(formik.errors.country && formik.touched.country)}
                >
                  {(item) => {
                    return <span>{item}</span>;
                  }}
                </Select>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" variant="primary" disabled={!formik.isValid}>
          Continue to Payment
        </Button>
      </form>
    </div>
  );
};
