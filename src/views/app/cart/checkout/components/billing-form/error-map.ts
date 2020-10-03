export const stripeCardErrors: { [key: string]: string } = {
  invalid_number: 'is not a valid credit card number',
  invalid_expiry_month: 'month is invalid',
  invalid_expiry_year: 'year is invalid',
  invalid_cvc: 'code is invalid',
  incomplete: 'details are incomplete',
  incorrect_number: 'is incorrect',
  incomplete_number: 'is incomplete',
  incomplete_cvc: 'code is incomplete',
  incomplete_expiry: 'is incomplete',
  incorrect_cvc: 'code is incorrect',
  incorrect_zip: 'failed validation',
  invalid_expiry_year_past: 'year is in the past',
};
