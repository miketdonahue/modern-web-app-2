import { NormalizedError } from '@modules/api-response';

/**
 * Stripe error normalizer
 */
export const handleStripeError = (error: any) => {
  switch (error.type) {
    case 'StripeCardError': // A declined card error
    case 'StripeRateLimitError': // Too many requests made to the API too quickly
    case 'StripeInvalidRequestError': // Invalid parameters were supplied to Stripe's API
    case 'StripeAPIError': // An error occurred internally with Stripe's API
    case 'StripeConnectionError': // Some kind of error occurred during the HTTPS communication
    case 'StripeAuthenticationError': // You probably used an incorrect API key
    default: {
      const errorResponse: NormalizedError = {
        statusCode: 500,
        response: {
          error: [
            {
              status: 500,
              code: error.code || null,
              detail:
                'Oops. Something went wrong. Please try again or contact support.',
            },
          ],
        },
      };

      return errorResponse;
    }
  }
};
