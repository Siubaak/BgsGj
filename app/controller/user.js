'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, account, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.user.findById(id);
      else if (account) result = await ctx.service.user.findByAccount(account);
      else result = await ctx.service.user.find({ skip: Number(skip), limit: Number(limit) });
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        account: { type: 'string' },
        password: { type: 'string' },
      });
      const result = await ctx.service.user.create(ctx.request.body);
      if (result && result._id) {
        ctx.logger.info(`[user] user-${ctx.state.user.id} created a user-${result._id}`);
        ctx.status = 201;
        ctx.set('Location', `${ctx.app.config.prefix}/users?id=${result._id}`);
        ctx.body = { id: result._id, account: result.account };
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
        id: { type: 'string' },
        password: { type: 'string' },
        user: { type: 'object' },
      });
      if (ctx.state.user.level < 4) ctx.request.body.user._id = ctx.request.body.id;
      const result = await ctx.service.user.update(ctx.request.body);
      if (result && result._id) {
        ctx.logger.info(`[user] user-${ctx.state.user.id} updated a user-${result._id}`);
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
      const result = await ctx.service.user.removeById(ctx.request.body._id);
      if (result[0] && result[0].result && result[0].result.n && result[0].result.ok) {
        ctx.logger.info(`[user] user-${ctx.state.user.id} removed a user-${result._id}`);
        ctx.status = 204;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.USER.NOEXIST;
      }
    }
  };
};
