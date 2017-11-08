'use strict';

const sha1 = require('../../lib/sha1');

module.exports = app => {
  return class extends app.Service {
    async create({ account, password }) {
      this.ctx.logger.info(`[token] ${this.ctx.ip} try to create a token`);
      const user = await app.model.User.findOne({ account });
      if (user && sha1(password) === user.password) {
        await app.model.User.update({ _id: user._id }, { $set: { lastSeen: new Date() } });
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + app.config.expiry);
        const token = app.jwt.sign({
          id: user._id,
          level: user.level,
          exp: expiry.getTime(),
        }, app.config.jwtSecret);
        this.ctx.logger.info(`[token] ${this.ctx.ip} created a token - ${token}`);
        return token;
      }
      return null;
    }
  };
};
