'use strict';

module.exports = app => {
  return class extends app.Controller {
    async create(ctx) {
      ctx.validate({
        account: { type: 'string' },
        password: { type: 'string' },
      });
      ctx.logger.info(`[token] ip-${ctx.ip} try to create a token with account-${ctx.request.body.account}`);
      const token = await ctx.service.token.create(ctx.request.body);
      if (token) {
        ctx.logger.info(`[token] ip-${ctx.ip} created a token-${token}`);
        ctx.status = 201;
        ctx.body = { token };
        return;
      }
      ctx.status = 403;
      ctx.body = { code: 'auth:user_not_found', msg: '用户名或密码错误' };
    }
  };
};
