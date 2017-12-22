'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.Metbook.count();
    }
    async find({ user, skip = 0, limit = 0 }) {
      let query;
      switch (user) {
        case undefined:
          break;
        case 'back':
          query = { cond: { $lt: 2 } };
          break;
        default:
          query = { user, cond: { $lt: 2 } };
      }
      const list = await app.model.Metbook.find(query)
        .populate('user', 'account')
        .sort({ cond: 1, _id: -1 })
        .skip(skip)
        .limit(limit);
      const total = await app.model.Metbook.count(query);
      return { total, list };
    }
    async findById(id) {
      return await app.model.Metbook.findById(id).populate('user', 'account') || {};
    }
    async create(metBook) {
      if (!app.config.isMeetingAvailable) return app.config.ERROR.MEETING.NOEXIST;
      const metBooksNum = await app.model.Metbook.count({ user: metBook.user, cond: { $lt: 2 } });
      if (metBooksNum >= app.config.maxMetBooks) return app.config.ERROR.METBOOK.INSUFFI;
      const isBook = await app.model.Metbook.findOne({ date: metBook.date, time: metBook.time, cond: { $lt: 2 } });
      if (isBook) return app.config.ERROR.MEETING.INSUFFI;
      if (!app.config.isProjAvailable) metBook.proj = false;
      return app.model.Metbook.create(metBook);
    }
    async update(metBook) {
      if (metBook.cond) {
        const metB = await app.model.Metbook.findById(metBook._id);
        if (!metB) return app.config.ERROR.METBOOK.NOEXIST;
        if (metB.cond > metBook.cond
          || metB.cond === 0 && metBook.cond === 2
          || metB.cond === 1 && metBook.cond === 3
          || metB.cond === 2 || metB.cond === 3) return app.config.ERROR.METBOOK.INVALID;
      }
      return await app.model.Metbook.findOneAndUpdate({ _id: metBook._id }, { $set: metBook }, { new: true });
    }
    async removeById(_id) {
      return await app.model.Metbook.remove({ _id });
    }
  };
};
