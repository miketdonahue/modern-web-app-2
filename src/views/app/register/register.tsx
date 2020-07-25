import React from 'react';
import { useRouter } from 'next/router';
import registerBg from '@public/images/register-bg.jpg';
import styles from './register.module.scss';
import { SignUpForm } from './partials/sign-up-form';

const Register = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/app/login');
  };

  return (
    <div className={styles.grid}>
      <div className={styles.gridLeft}>
        <div className={styles.registerGrid}>
          <SignUpForm successUrl="/app" onLogin={handleLogin} />
        </div>
      </div>
      <div className={styles.gridMiddle}>
        <svg
          className="absolute h-full w-40 text-white"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="50,0 100,0 50,100 0,100" />
        </svg>
      </div>
      <div className={styles.gridRight}>
        <img
          src={registerBg}
          alt="Background"
          className="w-screen h-screen object-cover"
        />
      </div>
    </div>
  );
};

export { Register };
