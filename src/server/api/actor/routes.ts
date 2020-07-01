import * as controller from './controller';

export default {
  path: '/api/v1/actor',
  routes: [
    {
      path: '/unlock-account',
      method: 'post',
      controller: controller.unlockActorAccount,
    },
  ],
};
