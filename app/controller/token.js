'use strict';

module.exports = app => {
  return class extends app.Controller {
    async create(ctx) {
      ctx.validate({
        account: { type: 'string' },
        password: { type: 'string' },
      });
      ctx.logger.info(`[token] ip-${ctx.ip} try to create a token with account-${ctx.request.body.account}`);
      const result = await ctx.service.token.create(ctx.request.body);
      if (result && result.token) {
        ctx.logger.info(`[token] ip-${ctx.ip} created a token-${result.token}`);
        ctx.status = 201;
        ctx.body = result;
      } else if (result && result.err) {
        ctx.status = 400;
        ctx.body = result;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.SERVER.BADREQ;
      }
    }
  };
};
