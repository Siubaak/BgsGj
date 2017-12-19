'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.User.count();
    }
    async find({ all = true, skip = 0, limit = 0 }) {
      let query;
      if (!all) query = { level: { $lt: 3 } };
      const list = await app.model.User.find(query, { password: 0 })
        .sort({ level: -1, account: 1 })
        .skip(skip)
        .limit(limit);
      const total = await app.model.User.count(query);
      return { total, list };
    }
    async findById(_id) {
      return await app.model.User.findOne({ _id }, { password: 0 }) || {};
    }
    async findByAccount(account) {
      return await app.model.User.findOne({ account }, { password: 0 }) || {};
    }
    async create(user) {
      if (user.level && user.level > 3) {
        const adminNum = await app.model.User.count({ level: { $gt: 3 } });
        if (adminNum) return app.config.ERROR.USER.INVALID;
      }
      user.password = this.ctx.helper.sha1(user.password);
      return await app.model.User.create(user);
    }
    async update(user) {
      if (user.level && user.level > 3) {
        const adminNum = await app.model.User.count({ level: { $gt: 3 } });
        if (adminNum) return app.config.ERROR.USER.INVALID;
      }
      if (user.password) user.password = this.ctx.helper.sha1(user.password);
      return await app.model.User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
    }
    async removeById(_id) {
      return await Promise.all([
        app.model.User.remove({ _id }),
        app.model.Matbook.remove({ user: _id }),
        app.model.Metbook.remove({ user: _id }),
      ]);
    }
  };
};
