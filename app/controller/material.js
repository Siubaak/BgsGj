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
    }
    async update(ctx) {
    }
    async remove(ctx) {
    }
  };
};
