'use strict';

module.exports = app => {
  // 权限分级中间件
  const perm = app.middlewares.permission;
  // 物资申请matbook资源api
  app.get(`${app.config.prefix}/matbooks`, perm(1), app.controller.matbook.get);
  app.post(`${app.config.prefix}/matbooks`, perm([ 1, 2 ]), app.controller.matbook.create);
  app.put(`${app.config.prefix}/matbooks`, perm(3), app.controller.matbook.update);
  app.del(`${app.config.prefix}/matbooks`, perm([ 1, 2, 4 ]), app.controller.matbook.remove);
  // 物资material资源api
  app.get(`${app.config.prefix}/materials`, perm([ 1, 2, 4 ]), app.controller.material.get);
  app.post(`${app.config.prefix}/materials`, perm(4), app.controller.material.create);
  app.put(`${app.config.prefix}/materials`, perm(4), app.controller.material.update);
  app.del(`${app.config.prefix}/materials`, perm(4), app.controller.material.remove);
  // 会议室预约metbook资源api
  app.get(`${app.config.prefix}/metbooks`, perm(2), app.controller.metbook.get);
  app.post(`${app.config.prefix}/metbooks`, perm([ 2 ]), app.controller.metbook.create);
  app.put(`${app.config.prefix}/metbooks`, perm(3), app.controller.metbook.update);
  app.del(`${app.config.prefix}/metbooks`, perm([ 2, 4 ]), app.controller.metbook.remove);
  // 会议室meeting资源api
  app.get(`${app.config.prefix}/meetings`, perm(2), app.controller.meeting.get);
  app.put(`${app.config.prefix}/meetings`, perm(3), app.controller.meeting.update);
  // 通知note资源api
  app.get(`${app.config.prefix}/notes`, app.controller.note.get);
  app.get(`${app.config.prefix}/anotes`, perm(4), app.controller.note.aget);
  app.post(`${app.config.prefix}/notes`, perm(4), app.controller.note.create);
  app.put(`${app.config.prefix}/notes`, perm(4), app.controller.note.update);
  app.del(`${app.config.prefix}/notes`, perm(4), app.controller.note.remove);
  // 授权token资源api
  app.post(`${app.config.prefix}/tokens`, app.controller.token.create);
  // 用户user资源api
  app.get(`${app.config.prefix}/users`, app.controller.user.get);
  app.get(`${app.config.prefix}/ausers`, perm(4), app.controller.user.aget);
  app.post(`${app.config.prefix}/users`, perm(4), app.controller.user.create);
  app.put(`${app.config.prefix}/users`, perm(0), app.controller.user.update);
  app.del(`${app.config.prefix}/users`, perm(4), app.controller.user.remove);
};
