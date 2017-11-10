'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.matbook.findById(id);
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
        result = await ctx.service.matbook.find(query);
      }
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        user: { type: 'string' },
        name: { type: 'string' },
        phone: { type: 'string' },
        takeDate: { type: 'string' },
        returnDate: { type: 'string' },
        materials: { type: 'array' },
      });
      const result = await ctx.service.matbook.create(ctx.request.body);
      if (result && result._id) {
        ctx.logger.info(`[matbook] user-${ctx.state.user.id} created a material book-${result._id}`);
        ctx.status = 201;
        ctx.set('Location', '/api/matbooks?id=' + result._id);
        ctx.body = { id: result._id };
      } else if (result) {
        ctx.status = 400;
        ctx.body = result;
      } else {
        ctx.status = 400;
        ctx.body = { code: 'error:bad_request', msg: '参数错误' };
      }
    }
    update() {
    }
    remove() {
    }
  };
};
