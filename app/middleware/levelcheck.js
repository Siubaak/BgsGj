'use strict';

const jwt = require('jsonwebtoken');

module.exports = levels => {
  return async (ctx, next) => {
    if (ctx.headers.authorization) {
      // 解密jwt
      const token = ctx.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token, ctx.app.config.jwtSecret);
      // jwt是否过期
      if (decoded.exp < Date.now()) {
        ctx.status = 403;
        ctx.body = { code: 'auth:auth_expire', msg: '授权已过期' };
        return;
      }
      // 数据库是否存在该用户
      const user = await ctx.service.user.findById(decoded.id);
      if (!user) {
        ctx.status = 403;
        ctx.body = { code: 'auth:user_not_found', msg: '用户不存在' };
        return;
      }
      // 更新用户登录时间
      user.lastSeen = new Date();
      await ctx.service.user.update({ _id: decoded.id, lastSeen: new Date() });
      // 判断权限
      ctx.state.level = user.level;
      if (Array.isArray(levels) && levels.indexOf(user.level) !== -1) return next();
      else if (typeof levels === 'number' && levels <= user.level) return next();
    }
    ctx.status = 403;
    ctx.body = { code: 'auth:no_auth', msg: '请登录' };
  };
};
