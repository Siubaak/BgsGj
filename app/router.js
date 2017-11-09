'use strict';

module.exports = app => {
  // 权限分级中间件
  const perm = app.middlewares.permission;
  // 物资申请matbook资源api
  app.get('/api/matbooks', perm(1), app.controller.matbook.get);
  app.post('/api/matbooks', perm([ 1, 2 ]), app.controller.matbook.create);
  app.put('/api/matbooks', perm(3), app.controller.matbook.update);
  app.del('/api/matbooks', perm([ 1, 2, 4 ]), app.controller.matbook.remove);
  // 物资material资源api
  app.get('/api/materials', perm([ 1, 2, 4 ]), app.controller.material.get);
  app.post('/api/materials', perm(4), app.controller.material.create);
  app.put('/api/materials', perm(4), app.controller.material.update);
  app.del('/api/materials', perm(4), app.controller.material.remove);
  // 会议室预约metbook资源api
  app.get('/api/metbooks', perm(2), app.controller.metbook.get);
  app.post('/api/metbooks', perm([ 2 ]), app.controller.metbook.create);
  app.put('/api/metbooks', perm(3), app.controller.metbook.update);
  app.del('/api/metbooks', perm([ 2, 4 ]), app.controller.metbook.remove);
  // 通知note资源api
  app.get('/api/notes', app.controller.note.get);
  app.post('/api/notes', perm(4), app.controller.note.create);
  app.put('/api/notes', perm(4), app.controller.note.update);
  app.del('/api/notes', perm(4), app.controller.note.remove);
  // 授权token资源api
  app.post('/api/tokens', app.controller.token.create);
  // 用户user资源api
  app.get('/api/users', app.controller.user.get);
  app.post('/api/users', perm(4), app.controller.user.create);
  app.put('/api/users', perm([ 0, 1, 2, 4 ]), app.controller.user.update);
  app.del('/api/users', perm(4), app.controller.user.remove);
};
