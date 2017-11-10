'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { skip, limit } = ctx.query;
      const result = await ctx.service.material.find({ skip: Number(skip), limit: Number(limit) });
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
        ctx.set('Location', '/api/materials?id=' + result._id);
        ctx.body = { id: result._id };
      } else {
        ctx.status = 400;
        ctx.body = { code: 'error:bad_request', msg: '参数错误' };
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
      } else {
        ctx.status = 400;
        ctx.body = { code: 'error:material_not_found', msg: '物资不存在' };
      }
    }
    async remove(ctx) {
      const { id } = ctx.query;
      let result;
      if (id) result = await ctx.service.material.removeById(id);
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:bad_request', msg: '参数错误' };
        return;
      }
      if (result) {
        ctx.logger.info(`[material] user-${ctx.state.user.id} removed a material-${result._id}`);
        ctx.status = 204;
      } else {
        ctx.status = 400;
        ctx.body = { code: 'error:material_not_found', msg: '物资不存在' };
      }
    }
  };
};
