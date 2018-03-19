'use strict';

module.exports = app => {
  return class extends app.Controller {
    async get(ctx) {
      const { settings, id, skip, limit } = ctx.query;
      let result;
      if (settings) result = await ctx.service.meeting.settings();
      else if (id) result = await ctx.service.meeting.findById(id);
      else {
        const query = { skip: Number(skip), limit: Number(limit) };
        switch (ctx.state.user.level) {
          case 4:
            break;
          default:
            query.enable = true;
        }
        result = await ctx.service.meeting.find(query);
      }
      ctx.status = 200;
      ctx.body = result;
    }
    async create(ctx) {
      ctx.validate({
        name: { type: 'string' },
        times: { type: 'array' },
      });
      const result = await ctx.service.meeting.create(ctx.request.body);
      if (result && result._id) {
        ctx.logger.info(`[meeting] user-${ctx.state.user.id} created a meeting-${result._id}`);
        ctx.status = 201;
        ctx.set('Location', `${ctx.app.config.prefix}/meetings?id=${result._id}`);
        ctx.body = { id: result._id };
      } else if (result && result.err) {
        ctx.status = 400;
        ctx.body = result;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.SERVER.BADREQ;
      }
    }
    async update(ctx) {
      if (typeof ctx.request.body.gEnable === 'boolean') {
        app.config.isMeetingAvailable = ctx.request.body.gEnable;
        ctx.logger.info(`[meeting] user-${ctx.state.user.id} updated meeting settings`);
        ctx.status = 204;
      } else {
        ctx.validate({
          _id: { type: 'string' },
        });
        const result = await ctx.service.meeting.update(ctx.request.body);
        if (result) {
          ctx.logger.info(`[meeting] user-${ctx.state.user.id} updated a meeting-${result._id}`);
          ctx.status = 204;
        } else if (result && result.err) {
          ctx.status = 400;
          ctx.body = result;
        } else {
          ctx.status = 400;
          ctx.body = ctx.app.config.ERROR.SERVER.BADREQ;
        }
      }
    }
    async remove(ctx) {
      ctx.validate({
        _id: { type: 'string' },
      });
      const result = await ctx.service.meeting.removeById(ctx.request.body._id);
      if (result[0] && result[0].result && result[0].result.n && result[0].result.ok) {
        ctx.logger.info(`[meeting] user-${ctx.state.user.id} removed a meeting-${result._id}`);
        ctx.status = 204;
      } else {
        ctx.status = 400;
        ctx.body = ctx.app.config.ERROR.MEETING.NOEXIST;
      }
    }
  };
};
