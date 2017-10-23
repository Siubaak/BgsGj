'use strict';

module.exports = app => {
  // 权限分级中间件
  const lc = app.middlewares.levelcheck;
  // 物资申请matbook资源api
  app.get('/api/matbooks', lc(1), app.controller.matbook.get);
  app.post('/api/matbooks', lc([ 1, 2 ]), app.controller.matbook.create);
  app.put('/api/matbooks', lc(3), app.controller.matbook.update);
  app.del('/api/matbooks', lc([ 1, 2, 4 ]), app.controller.matbook.remove);
  // 物资material资源api
  app.get('/api/materials', lc([ 1, 2, 4 ]), app.controller.material.get);
  app.post('/api/materials', lc(4), app.controller.material.create);
  app.put('/api/materials', lc(4), app.controller.material.update);
  app.del('/api/materials', lc(4), app.controller.material.remove);
  // 会议室预约metbook资源api
  app.get('/api/metbooks', lc(2), app.controller.metbook.get);
  app.post('/api/metbooks', lc([ 2 ]), app.controller.metbook.create);
  app.put('/api/metbooks', lc(3), app.controller.metbook.update);
  app.del('/api/metbooks', lc([ 2, 4 ]), app.controller.metbook.remove);
  // 通知note资源api
  app.get('/api/notes', app.controller.note.get);
  app.post('/api/notes', lc(4), app.controller.note.create);
  app.put('/api/notes', lc(4), app.controller.note.update);
  app.del('/api/notes', lc(4), app.controller.note.remove);
  // 授权token资源api
  app.post('/api/tokens', app.controller.token.create);
  // 用户user资源api
  app.get('/api/users', app.controller.user.get);
  app.post('/api/users', lc(4), app.controller.user.create);
  app.put('/api/users', lc([ 0, 1, 2, 4 ]), app.controller.user.update);
  app.del('/api/users', lc(4), app.controller.user.remove);
};
