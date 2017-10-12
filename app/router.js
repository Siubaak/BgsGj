'use strict';

module.exports = app => {
  // 权限分级中间件
  const lc = app.middlewares.levelcheck;
  // token资源api
  app.post('/api/token', app.controller.token.create);
  // user资源api
  app.get('/api/user', lc(0), app.controller.user.get);
  app.post('/api/user', lc(4), app.controller.user.create);
  app.put('/api/user', lc([ 0, 1, 2, 4 ]), app.controller.user.update);
  app.del('/api/user', lc(4), app.controller.user.remove);
};
