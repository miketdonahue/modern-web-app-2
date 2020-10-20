import React from 'react';
import { useRouter } from 'next/router';
import { useCreateCart, useSyncCartItems } from '@modules/queries/carts';
import { useCreatePaymentSession } from '@modules/queries/payments';
import { useShoppingCart } from '@components/hooks/use-shopping-cart';
import { useCheckout } from '@components/hooks/use-checkout';
import { Error } from '@modules/api-response';
import { SignInForm } from './partials/sign-in-form';
import styles from './login.module.scss';

const Login = () => {
  const router = useRouter();
  const { items, updateCart } = useShoppingCart();
  const [createPaymentSession] = useCreatePaymentSession();
  const [createCart] = useCreateCart();
  const [syncCartItems] = useSyncCartItems({
    onSuccess: (result) => {
      updateCart(result.data);
    },
  });

  const [infoMessage, setInfoMessage] = React.useState('');
  const [serverErrors, setServerErrors] = React.useState<Error[]>([]);

  React.useEffect(() => {
    if (
      router.query.return_to === 'checkout' &&
      router.query.referrer === 'register'
    ) {
      return setInfoMessage(
        "You've signed up successfully. Please log in to continue the check out process."
      );
    }

    if (router.query.referrer === 'register') {
      return setInfoMessage(
        "You've signed up successfully. Please log in to continue."
      );
    }

    return undefined;
  }, []);

  const handleCreateAccount = () => {
    if (router.query.return_to === 'checkout') {
      return router.push({
        pathname: '/app/register',
        query: { ...router.query, referrer: 'register' },
      });
    }

    return router.push('/app/register', '/app/register');
  };

  const handleSignInSuccess = async () => {
    if (router.query.return_to === 'checkout') {
      createCart(
        {},
        {
          onSuccess: (createdCart) => {
            syncCartItems({
              cartId: createdCart.data.attributes.id || '',
              cartItems: items || [],
            });
          },
        }
      );

      const response = await createPaymentSession({
        orderItems: items,
      });

      const checkoutError = await useCheckout({
        sessionId: response.data.attributes.id,
      });

      if (checkoutError) {
        return setServerErrors([{ ...checkoutError }]);
      }

      return undefined;
    }

    return router.push('/app');
  };

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.loginGrid}>
          <SignInForm
            onSuccess={handleSignInSuccess}
            onRegister={handleCreateAccount}
            infoMessage={infoMessage}
            additionalServerErrors={serverErrors}
          />
        </div>
      </div>
      <div className={styles.gridRight}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 538 768"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0)">
            <rect width="538" height="768" fill="#68D391" />
            <path
              d="M646.504 -172.224L745.903 276.292L307.777 138.116L646.504 -172.224Z"
              fill="white"
              fillOpacity="0.1"
            />
            <rect
              width="20"
              height="20"
              transform="matrix(0.910492 0.413527 -0.413526 0.910492 453.271 535)"
              fill="white"
              fillOpacity="0.1"
            />
            <path
              d="M118 429L124.735 449.729H146.532L128.898 462.541L135.634 483.271L118 470.459L100.366 483.271L107.102 462.541L89.4683 449.729H111.265L118 429Z"
              fill="white"
              fillOpacity="0.1"
            />
            <rect
              x="171.956"
              y="219"
              width="55.55"
              height="20.7855"
              transform="rotate(15.9132 171.956 219)"
              fill="white"
              fillOpacity="0.1"
            />
            <circle cx="169" cy="791" r="127" fill="white" fillOpacity="0.1" />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="538" height="768" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export { Login };
