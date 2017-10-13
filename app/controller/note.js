'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, title, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.note.findById(id);
      else if (title) result = await ctx.service.note.findByTitle(title);
      else result = await ctx.service.note.find({ skip, limit });
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        body: { type: 'string' },
      });
      const result = await ctx.service.note.create(ctx.request.body);
      ctx.status = 201;
      ctx.set('Location', '/api/note?id=' + result._id);
      ctx.body = { id: result._id };
    }
    async update(ctx) {
      ctx.validate({
        note: { type: 'object' },
      });
      const result = await ctx.service.note.update(ctx.request.body);
      if (result) ctx.status = 204;
      else {
        ctx.status = 403;
        ctx.body = { code: 'auth:user_not_found', msg: '用户名或密码错误' };
      }
    }
    async remove(ctx) {
      const { id } = ctx.query;
      let result;
      if (id) result = await ctx.service.note.removeById(id);
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:bad_params', msg: '参数错误' };
        return;
      }
      if (result) ctx.status = 204;
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:note_not_found', msg: '该通知不存在' };
      }
    }
  };
};
