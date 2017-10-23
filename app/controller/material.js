'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { skip, limit } = ctx.query;
      const query = ctx.state.level === 4 ? { all: true, skip, limit } : { all: false };
      const result = await ctx.service.material.find(query);
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        type: { type: 'string' },
        name: { type: 'string' },
      });
      const result = await ctx.service.material.create(ctx.request.body);
      ctx.status = 201;
      ctx.set('Location', '/api/material?id=' + result._id);
      ctx.body = { id: result._id };
    }
    async update(ctx) {
      ctx.validate({
        _id: { type: 'string' },
      });
      const result = await ctx.service.material.update(ctx.request.body);
      if (result.result.ok) ctx.status = 204;
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:material_not_found', msg: '该物资不存在' };
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
      if (result) ctx.status = 204;
      else {
        ctx.status = 400;
        ctx.body = { code: 'error:material_not_found', msg: '该物资不存在' };
      }
    }
  };
};
