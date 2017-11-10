'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.User.count();
    }
    async find({ skip = 0, limit = 0 }) {
      return await app.model.User.find({ level: { $lt: 3 } }, { password: 0 }).sort({ account: 1 })
        .skip(skip)
        .limit(limit);
    }
    async findById(_id) {
      return await app.model.User.findOne({ _id }, { password: 0 }) || {};
    }
    async findByAccount(account) {
      return await app.model.User.findOne({ account }, { password: 0 }) || {};
    }
    async create(user) {
      user.password = this.ctx.helper.sha1(user.password);
      return await app.model.User.create(user);
    }
    async update({ id, password, user }) {
      const info = await app.model.User.findById(id);
      if (info && info.password === this.ctx.helper.sha1(password)) {
        return await app.model.User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
      }
      return null;
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
