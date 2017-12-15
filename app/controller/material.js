'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.material.findById(id);
      else {
        const query = { skip: Number(skip), limit: Number(limit) };
        switch (ctx.state.user.level) {
          case 4:
            break;
          default:
            query.enable = true;
        }
        result = await ctx.service.material.find(query);
      }
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        type: { type: 'string' },
        name: { type: 'string' },
      });
      const result = await ctx.service.material.create(ctx.request.body);
      if (result && result._id) {
        ctx.logger.info(`[material] user-${ctx.state.user.id} created a material-${result._id}`);
        ctx.status = 201;
        ctx.set('Location', `${ctx.app.config.prefix}/materials?id=${result._id}`);
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
      const result = await ctx.service.material.update(ctx.request.body);
      if (result) {
        ctx.logger.info(`[material] user-${ctx.state.user.id} updated a material-${result._id}`);
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
      const result = await ctx.service.material.removeById(ctx.request.body._id);
      if (result[0] && result[0].result && result[0].result.n && result[0].result.ok) {
        ctx.logger.info(`[material] user-${ctx.state.user.id} removed a material-${result._id}`);
        ctx.status = 204;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.MATERIAL.NOEXIST;
      }
    }
  };
};
