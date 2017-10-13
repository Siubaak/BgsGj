'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, account, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.user.findById(id);
      else if (account) result = await ctx.service.user.findByAccount(account);
      else result = await ctx.service.user.find({ skip, limit });
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        account: { type: 'string' },
        password: { type: 'string' },
      });
      const result = await ctx.service.user.create(ctx.request.body);
      ctx.status = 201;
      ctx.set('Location', '/api/user?id=' + result._id);
      ctx.body = { id: result._id, account: result.account };
    }
    async update(ctx) {
      ctx.validate({
        id: { type: 'string' },
        password: { type: 'string' },
        user: { type: 'object' },
      });
      if (ctx.status.level < 4) ctx.request.body.user._id = ctx.request.body.id;
      const result = await ctx.service.user.update(ctx.request.body);
      if (result) ctx.status = 204;
      else {
        ctx.status = 403;
        ctx.body = { code: 'auth:user_not_found', msg: '用户名或密码错误' };
      }
    }
    async remove(ctx) {
      const { id } = ctx.query;
      let result;
      if (id) result = await ctx.service.user.removeById(id);
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:bad_request', msg: '参数错误' };
        return;
      }
      if (result) ctx.status = 204;
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:user_not_found', msg: '该用户不存在' };
      }
    }
  };
};
