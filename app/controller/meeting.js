'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { settings } = ctx.query;
      let result;
      if (settings) result = await ctx.service.meeting.settings();
      else result = await ctx.service.meeting.find();
      ctx.status = 200;
      ctx.body = result;
    }
    async update(ctx) {
      ctx.validate({
        enable: { type: 'boolean' },
        proj: { type: 'boolean' },
      });
      await ctx.service.meeting.update(ctx.request.body);
      ctx.logger.info(`[meeting] user-${ctx.state.user.id} updated meeting settings`);
      ctx.status = 204;
    }
  };
};
