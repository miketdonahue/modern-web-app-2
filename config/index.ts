import development from './development';
import production from './production';
import test from './test';

const env = process.env.NODE_ENV || 'development';
const configs: any = {
  development,
  production,
  test,
};

export const config: any = configs[env];
