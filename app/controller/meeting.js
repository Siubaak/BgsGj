'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const result = await ctx.service.meeting.find(ctx.query);
      ctx.status = 200;
      ctx.body = result;
    }
    async update(ctx) {
      ctx.validate({
        enable: { type: 'boolean' },
        proj: { type: 'boolean' },
      });
      await ctx.service.meeting.update(ctx.request.body);
      ctx.logger.info(`[meeting] user-${ctx.state.user.id} updated meeting`);
      ctx.status = 204;
    }
  };
};
