'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.metbook.findById(id);
      else {
        const query = { skip: Number(skip), limit: Number(limit) };
        switch (ctx.state.user.level) {
          case 4:
            break;
          case 3:
            query.user = 'back';
            break;
          default:
            query.user = ctx.state.user._id;
        }
        result = await ctx.service.metbook.find(query);
      }
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        user: { type: 'string' },
        name: { type: 'string' },
        phone: { type: 'string' },
        date: { type: 'string' },
        time: { type: 'string' },
      });
      const result = await ctx.service.metbook.create(ctx.request.body);
      if (result && result._id) {
        ctx.logger.info(`[metbook] user-${ctx.state.user.id} created a meeting book-${result._id}`);
        ctx.status = 201;
        ctx.set('Location', `${ctx.app.config.prefix}/metbooks?id=${result._id}`);
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
      ctx.helper.delProps(ctx.request.body, [ 'user', 'date', 'time' ]);
      const result = await ctx.service.metbook.update(ctx.request.body);
      if (result && result._id) {
        ctx.logger.info(`[metbook] user-${ctx.state.user.id} updated a meeting book-${result._id}`);
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
      const result = await ctx.service.metbook.removeById(ctx.request.body._id);
      if (result && result.result && result.result.n && result.result.ok) {
        ctx.logger.info(`[metbook] user-${ctx.state.user.id} removed a meeting book-${result._id}`);
        ctx.status = 204;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.METBOOK.NOEXIST;
      }
    }
  };
};
