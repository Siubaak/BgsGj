'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { id, user, skip, limit } = ctx.query;
      let result;
      if (id) result = await ctx.service.matbook.findById(id);
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
        result = await ctx.service.matbook.find(query);
      }
      ctx.status = 200;
      ctx.body = result;
    }
    create() {
    }
    update() {
    }
    remove() {
    }
  };
};
