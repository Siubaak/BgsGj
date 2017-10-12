'use strict';

const sha1 = require('sha1');
const jwt = require('jsonwebtoken');

module.exports = app => {
  return class extends app.Service {
    async create({ account, password }) {
      const user = await app.model.User.findOne({ account });
      if (user && sha1(password) === user.password) {
        await app.model.User.update({ _id: user._id }, { $set: { lastSeen: new Date() } });
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + app.config.expiry);
        return jwt.sign({
          id: user._id,
          level: user.level,
          exp: expiry.getTime(),
        }, app.config.jwtSecret);
      } return null;
    }
  };
};
