import * as controller from './controller';

export default {
  path: '/api/v1/auth',
  routes: [
    {
      path: '/register',
      method: 'post',
      controller: controller.registerActor,
    },
    {
      path: '/security-code',
      method: 'post',
      controller: controller.confirmCode,
    },
    {
      path: '/login',
      method: 'post',
      controller: controller.loginActor,
    },
    {
      path: '/reset-password',
      method: 'post',
      controller: controller.resetPassword,
    },
    {
      path: '/logout',
      method: 'post',
      controller: controller.logoutActor,
    },
    {
      path: '/send-code',
      method: 'post',
      controller: controller.sendCode,
    },
  ],
};
