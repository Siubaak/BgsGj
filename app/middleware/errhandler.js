'use strict';

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404) ctx.body = ctx.app.config.ERROR.SERVER.NOTFUND;
    } catch (e) {
      ctx.status = 500;
      ctx.body = ctx.app.config.ERROR.SERVER.INERROR;
    }
  };
};
