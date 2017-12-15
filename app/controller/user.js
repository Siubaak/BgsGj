'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, account, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.user.findById(id);
      else if (account) result = await ctx.service.user.findByAccount(account);
      else result = await ctx.service.user.find({ all: false, skip: Number(skip), limit: Number(limit) });
      ctx.status = 200;
      ctx.body = result;
    }
    async aget(ctx) {
      const { skip, limit } = ctx.query;
      const result = await ctx.service.user.find({ skip: Number(skip), limit: Number(limit) });
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
        _id: { type: 'string' },
      });
      if (ctx.state.user.level < 4) {
        if (ctx.request.body._id !== ctx.state.user._id.toString()) {
          ctx.status = 403;
          ctx.body = ctx.app.config.ERROR.USER.NOPERM;
          return;
        }
        ctx.helper.delProps(ctx.request.body, [ 'account', 'wallet', 'level' ]);
      } else if (ctx.request.body._id === ctx.state.user._id.toString()) {
        ctx.helper.delProps(ctx.request.body, [ 'account', 'wallet', 'level' ]);
      }
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
      if (ctx.request.body._id === ctx.state.user._id.toString()) {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.USER.INVALID;
        return;
      }
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
