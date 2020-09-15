import React from 'react';
import { useMutation } from 'react-query';
import { useFormik } from 'formik';
import cx from 'classnames';
import { request } from '@modules/request';
import { useTailwind } from '@components/hooks/use-tailwind';
import { useMediaQuery } from '@components/hooks/use-media-query';
import { Input, Button, Select } from '@components/app';
import { SelectItem } from '@components/app/select/typings';
import { states } from '@modules/data/states';
import { countries } from '@modules/data/countries';
import { CartItem } from '@server/entities/cart-item';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  StripeCardElementChangeEvent,
  StripeCardElement,
} from '@stripe/stripe-js';
import { styles as inputStyles } from '@components/app/input';
import { createPaymentIntent } from '@modules/queries/payments';
import { billingFormValidationSchema } from './validations';
import { stripeCardErrors } from './error-map';

type BillingForm = {
  orderItems: Partial<CartItem>[];
};

export const BillingForm = ({ orderItems }: BillingForm) => {
  // const [serverErrors, setServerErrors] = React.useState<Error[]>([]);

  const tailwind = useTailwind();
  const { matchesMediaQuery } = useMediaQuery();
  const [createAPaymentIntent] = createPaymentIntent();
  const stripe = useStripe();
  const elements = useElements();

  const [cardErrors, setCardErrors] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState('');

  React.useEffect(() => {
    if (orderItems) {
      createAPaymentIntent({ orderItems }).then((response) => {
        setClientSecret(response.data.attributes.clientSecret);
      });
    }
  }, [orderItems]);

  const [createCustomer] = useMutation((values: any) =>
    request.post('/api/v1/customers', values)
  );

  const formik = useFormik({
    validateOnChange: false,
    validateOnMount: true,
    initialValues: {
      address_line1: '',
      address_line2: '',
      city: '',
      state: { id: '', value: '', label: '' },
      postal_code: '',
      country: { id: '', value: '', label: '' },
      name: '',
      email: '',
    },
    validationSchema: billingFormValidationSchema,
    onSubmit: async (values) => {
      await createCustomer({ values });

      const confirmedPayment = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement) as StripeCardElement,
          billing_details: {
            address: {
              line1: values.address_line1,
              line2: values.address_line2,
              city: values.city,
              state: values.state.value,
              postal_code: values.postal_code,
              country: values.country.value,
            },
            email: values.email,
            name: values.name,
          },
        },
      });
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

  const handleCardChange = async (event: StripeCardElementChangeEvent) => {
    setCardErrors(event.error ? event.error.code : '');
  };

  const elementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        fontFamily: tailwind.theme.fontFamily.sans.join(','),
        fontSmoothing: 'antialiased',
        color: tailwind.theme.colors.text,
        lineHeight: matchesMediaQuery(tailwind.theme.screens['768'])
          ? tailwind.theme.lineHeight['6']
          : tailwind.theme.lineHeight['5'],
        fontSize: matchesMediaQuery(tailwind.theme.screens['768'])
          ? '16px'
          : '14px',
        '::placeholder': {
          color: tailwind.theme.colors.gray['500'],
        },
      },
      invalid: {
        color: tailwind.theme.colors.text,
      },
    },
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="address_line1" className="text-sm 768:text-base">
              <span>Address</span>
              {formik.errors.address_line1 && formik.touched.address_line1 ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.address_line1}
                </span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="address_line1"
                  name="address_line1"
                  type="text"
                  value={formik.values.address_line1}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    !!(
                      formik.errors.address_line1 &&
                      formik.touched.address_line1
                    )
                  }
                />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="address_line2" className="text-sm 768:text-base">
              <span>Address Line 2</span>
              {formik.errors.address_line2 && formik.touched.address_line2 ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.address_line2}
                </span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="address_line2"
                  name="address_line2"
                  type="text"
                  value={formik.values.address_line2}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    !!(
                      formik.errors.address_line2 &&
                      formik.touched.address_line2
                    )
                  }
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
                  currentValue={formik.values.state}
                  onSelection={(selected: SelectItem | null) => {
                    formik.setFieldValue('state', selected);
                    formik.setFieldError('state', undefined);
                  }}
                  error={!!(formik.errors.state && formik.touched.state)}
                >
                  {(item) => {
                    return <span>{item.label}</span>;
                  }}
                </Select>
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="postal_code" className="text-sm 768:text-base">
              <span>Postal code</span>
              {formik.errors.postal_code && formik.touched.postal_code ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {formik.errors.postal_code}
                </span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  value={formik.values.postal_code}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    !!(formik.errors.postal_code && formik.touched.postal_code)
                  }
                />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="country" className="text-sm 768:text-base">
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
                  currentValue={formik.values.country}
                  onSelection={(selected: SelectItem | null) => {
                    formik.setFieldValue('country', selected);
                    formik.setFieldError('country', undefined);
                  }}
                  error={!!(formik.errors.country && formik.touched.country)}
                >
                  {(item) => {
                    return <span>{item.label}</span>;
                  }}
                </Select>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-sm 768:text-base">
            <span>Email address</span>
            {formik.errors.email && formik.touched.email ? (
              <span className="text-red-600 mt-1"> {formik.errors.email}</span>
            ) : null}

            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="text"
                value={formik.values.email}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.errors.email && formik.touched.email)}
              />
            </div>
          </label>
        </div>

        <div>
          <div>
            <label htmlFor="name" className="text-sm 768:text-base">
              <span>Name on card</span>
              {formik.errors.name && formik.touched.name ? (
                <span className="text-red-600 mt-1"> {formik.errors.name}</span>
              ) : null}

              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={!!(formik.errors.name && formik.touched.name)}
                />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="name" className="text-sm 768:text-base">
              <span>Card number</span>
              {cardErrors ? (
                <span className="text-red-600 mt-1">
                  {' '}
                  {stripeCardErrors[cardErrors]}
                </span>
              ) : null}

              <div
                className={cx(inputStyles.input, {
                  [inputStyles.error]: cardErrors,
                })}
              >
                <CardElement
                  id="card-element"
                  options={elementOptions}
                  onChange={handleCardChange}
                />
              </div>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={!formik.isValid || !clientSecret}
        >
          Pay
        </Button>
      </form>
    </div>
  );
};
