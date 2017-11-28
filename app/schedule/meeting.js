'use strict';

module.exports = app => {
  return {
    schedule: {
      type: 'worker',
      cron: app.config.schedule,
    },
    async task(ctx) {
      const now = new Date();
      const today = now.toLocaleString().split(' ')[0];
      await ctx.service.meeting.schedule(today);
      ctx.logger.info('[schd] all metbooks today are returned');
    },
  };
};
