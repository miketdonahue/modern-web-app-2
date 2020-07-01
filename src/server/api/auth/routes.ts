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
      path: '/confirm',
      method: 'post',
      controller: controller.confirmActor,
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
      path: '/auth-email',
      method: 'post',
      controller: controller.sendAuthEmail,
    },
    {
      path: '/check-access',
      method: 'post',
      controller: controller.checkAccess,
    },
  ],
};
