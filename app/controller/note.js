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
      if (result && result._id) {
        ctx.logger.info(`[note] user-${ctx.state.user.id} created a note-${result._id}`);
        ctx.status = 201;
        ctx.set('Location', `${ctx.app.config.prefix}/notes?id=${result._id}`);
        ctx.body = { id: result._id };
      } else if (result && result.err) {
        ctx.status = 400;
        ctx.body = result;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.SERVER.BADREQ;
      }
    }
    async update(ctx) {
      ctx.validate({
        _id: { type: 'string' },
      });
      const result = await ctx.service.note.update(ctx.request.body);
      if (result && result._id) {
        ctx.logger.info(`[note] user-${ctx.state.user.id} updated a note-${result._id}`);
        ctx.status = 204;
      } else if (result && result.err) {
        ctx.status = 400;
        ctx.body = result;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.SERVER.BADREQ;
      }
    }
    async remove(ctx) {
      ctx.validate({
        _id: { type: 'string' },
      });
      const result = await ctx.service.note.removeById(ctx.request.body._id);
      if (result && result.result && result.result.n && result.result.ok) {
        ctx.logger.info(`[note] user-${ctx.state.user.id} removed a note-${result._id}`);
        ctx.status = 204;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.NOTE.NOEXIST;
      }
    }
  };
};
