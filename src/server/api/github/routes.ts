import * as controller from './controller';

export default {
  path: '/api/v1/github',
  routes: [
    {
      path: '/code',
      method: 'get',
      controller: controller.getGithubCode,
    },
    {
      path: '/file-contents',
      method: 'get',
      controller: controller.getGithubMarkdown,
    },
  ],
};
