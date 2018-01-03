'use strict';

module.exports = app => {
  return {
    schedule: {
      type: 'worker',
      cron: app.config.schedule,
    },
    async task(ctx) {
      const now = new Date();
      const days = ['日', '一', '二', '三', '四', '五', '六']
      const year = now.getFullYear();
      const month = now.getMonth() + 1; 
      const date = now.getDate();
      const day = days[now.getDay()];
      const today = `${year}年${month}月${date}日（周${day}）`
      await ctx.service.meeting.schedule(today);
      ctx.logger.info(`[schd] all metbooks on ${now.toLocaleString().split(' ')[0]} are returned`);
    },
  };
};

