export default {
  path: '/app/post',
  routes: [
    {
      path: '/:id',
      page: '/app/post/[id]',
    },
  ],
};
