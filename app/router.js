'use strict';

module.exports = app => {
  // 权限分级中间件
  const lc = app.middlewares.levelcheck;
  // 物资申请matbook资源api
  app.get('/api/matbook', lc(1), app.controller.matbook.get);
  app.post('/api/matbook', lc([ 1, 2 ]), app.controller.matbook.create);
  app.put('/api/matbook', lc(3), app.controller.matbook.update);
  app.del('/api/matbook', lc([ 1, 2, 4 ]), app.controller.matbook.remove);
  // 物资material资源api
  app.get('/api/material', lc([ 1, 2, 4 ]), app.controller.material.get);
  app.post('/api/material', lc(4), app.controller.material.create);
  app.put('/api/material', lc(4), app.controller.material.update);
  app.del('/api/material', lc(4), app.controller.material.remove);
  // 会议室预约metbook资源api
  app.get('/api/metbook', lc(2), app.controller.metbook.get);
  app.post('/api/metbook', lc([ 2 ]), app.controller.metbook.create);
  app.put('/api/metbook', lc(3), app.controller.metbook.update);
  app.del('/api/metbook', lc([ 2, 4 ]), app.controller.metbook.remove);
  // 通知note资源api
  app.get('/api/note', app.controller.note.get);
  app.post('/api/note', lc(4), app.controller.note.create);
  app.put('/api/note', lc(4), app.controller.note.update);
  app.del('/api/note', lc(4), app.controller.note.remove);
  // 授权token资源api
  app.post('/api/token', app.controller.token.create);
  // 用户user资源api
  app.get('/api/user', app.controller.user.get);
  app.post('/api/user', lc(4), app.controller.user.create);
  app.put('/api/user', lc([ 0, 1, 2, 4 ]), app.controller.user.update);
  app.del('/api/user', lc(4), app.controller.user.remove);
};
