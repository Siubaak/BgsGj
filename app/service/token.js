'use strict';

module.exports = app => {
  return class extends app.Service {
    async create({ account, password }) {
      const user = await app.model.User.findOne({ account });
      if (user && this.ctx.helper.sha1(password) === user.password) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + app.config.expiry);
        return app.jwt.sign({
          id: user._id,
          level: user.level,
          exp: expiry.getTime(),
        }, app.config.jwtSecret);
      }
      return null;
    }
  };
};
