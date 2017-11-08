'use strict';

const sha1 = require('../../lib/sha1');

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.User.count();
    }
    async find({ skip = 0, limit = 0 }) {
      return await app.model.User.find({ level: { $lte: 3 } }, { password: 0 }).sort({ account: 1 })
        .skip(skip)
        .limit(limit);
    }
    async findById(_id) {
      return await app.model.User.findOne({ _id }, { password: 0 });
    }
    async findByAccount(account) {
      return await app.model.User.findOne({ account }, { password: 0 });
    }
    async create(user) {
      user.password = sha1(user.password);
      user.creator = this.ctx.state.user._id;
      user.created = new Date();
      const newUser = await app.model.User.create(user);
      this.ctx.logger.info(`[user] ${user.creator} created a new user - ${newUser._id}`);
      return newUser;
    }
    async update({ id, password, user }) {
      const info = await app.model.User.findById(id);
      if (info && info.password === sha1(password)) {
        user.updator = this.ctx.state.user._id;
        user.updated = new Date();
        const result = await app.model.User.update({ _id: user._id }, { $set: user });
        this.ctx.logger.info(`[user] ${user.updator} updated a user - ${user._id}`);
        return result;
      }
      return false;
    }
    async removeById(_id) {
      const result = await Promise.all([
        app.model.User.remove({ _id }),
        app.model.Matbook.remove({ user: _id }),
        app.model.Matbitem.remove({ user: _id }),
        app.model.Metbook.remove({ user: _id }),
      ]);
      this.ctx.logger.info(`[user] ${this.ctx.state.user._id} removed a user - ${_id}`);
      return result;
    }
  };
};
