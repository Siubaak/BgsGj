'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, title, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.note.findById(id);
      else if (title) result = await ctx.service.note.findByTitle(title);
      else result = await ctx.service.note.find({ skip: Number(skip), limit: Number(limit) });
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        title: { type: 'string' },
        content: { type: 'string' },
      });
      const result = await ctx.service.note.create(ctx.request.body);
      ctx.logger.info(`[note] user-${ctx.state.user.id} created a note-${result._id}`);
      ctx.status = 201;
      ctx.set('Location', '/api/notes?id=' + result._id);
      ctx.body = { id: result._id };
    }
    async update(ctx) {
      ctx.validate({
        _id: { type: 'string' },
      });
      const result = await ctx.service.note.update(ctx.request.body);
      if (result) {
        ctx.logger.info(`[note] user-${ctx.state.user.id} updated a note-${result._id}`);
        ctx.status = 204;
      } else {
        ctx.status = 400;
        ctx.body = { code: 'error:bad_request', msg: '参数错误' };
      }
    }
    async remove(ctx) {
      const { id } = ctx.query;
      let result;
      if (id) result = await ctx.service.note.removeById(id);
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:bad_request', msg: '参数错误' };
        return;
      }
      if (result) {
        ctx.logger.info(`[note] user-${ctx.state.user.id} removed a note-${result._id}`);
        ctx.status = 204;
      } else {
        ctx.status = 400;
        ctx.body = { code: 'error:note_not_found', msg: '该通知不存在' };
      }
    }
  };
};
