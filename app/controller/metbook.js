'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, usage, user, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.metbook.findById(id);
      else if (usage) result = await ctx.service.metbook.getUsage();
      else {
        const query = { skip: Number(skip), limit: Number(limit) };
        switch (ctx.state.level) {
          case 4:
            break;
          case 3:
            query.user = 'back';
            break;
          default:
            query.user = user;
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
      ctx.status = 201;
      ctx.set('Location', '/api/metbooks?id=' + result._id);
      ctx.body = { id: result._id };
    }
    async update(ctx) {
      ctx.validate({
        _id: { type: 'string' },
      });
      const result = await ctx.service.metbook.update(ctx.request.body);
      if (result) ctx.status = 204;
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:metbook_not_found', msg: '该会议室预约申请不存在' };
      }
    }
    async remove(ctx) {
      const { id } = ctx.query;
      let result;
      if (id) result = await ctx.service.metbook.removeById(id);
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:bad_request', msg: '参数错误' };
        return;
      }
      if (result) ctx.status = 204;
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:metbook_not_found', msg: '该会议室预约申请不存在' };
      }
    }
  };
};
