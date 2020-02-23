export default {
  path: '/posts',
  routes: [
    {
      path: '/:id',
      page: '/post/[id]',
    },
  ],
};
