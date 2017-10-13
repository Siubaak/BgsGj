'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, usage, user, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.metbook.findById(id);
      else if (usage) result = await ctx.service.metbook.getUsage();
      else {
        const query = { skip, limit };
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
    }
    async update(ctx) {
    }
    async remove(ctx) {
    }
  };
};
