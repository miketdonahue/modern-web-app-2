import development from './development';
import production from './production';
import test from './test';

const env = process.env.NODE_ENV || 'development';
const config: any = {
  development,
  production,
  test,
};

export default config[env];
