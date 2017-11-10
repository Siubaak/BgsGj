'use strict';

module.exports = levels => {
  return async (ctx, next) => {
    // 是否授权并携带jwt
    if (!ctx.headers.authorization) {
      ctx.status = 403;
      ctx.body = { code: 'auth:no_auth', msg: '请登录' };
      return;
    }
    // 解密jwt
    const token = ctx.headers.authorization.split(' ')[1];
    const decoded = ctx.app.jwt.decode(token, ctx.app.config.jwtSecret);
    // jwt是否过期
    if (decoded.exp < Date.now()) {
      ctx.status = 403;
      ctx.body = { code: 'auth:auth_expire', msg: '授权已过期' };
      return;
    }
    // 数据库是否存在用户
    const user = await ctx.service.user.findById(decoded.id);
    if (!user) {
      ctx.status = 403;
      ctx.body = { code: 'auth:user_not_found', msg: '用户不存在' };
      return;
    }
    // 判断权限
    ctx.state.user = user;
    if (Array.isArray(levels) && levels.indexOf(user.level) !== -1) return next();
    else if (typeof levels === 'number' && levels <= user.level) return next();
    ctx.status = 403;
    ctx.body = { code: 'auth:no_perm', msg: '权限不足' };
  };
};
