'use strict';

module.exports = app => {
  return class extends app.Service {
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
        .populate('meeting', 'name')
        .sort({ cond: 1, _id: -1 })
        .skip(skip)
        .limit(limit);
      const total = await app.model.Metbook.count(query);
      return { total, list };
    }
    async findById(id) {
      return await app.model.Metbook.findById(id)
        .populate('user', 'account')
        .populate('meeting', 'name') || {};
    }
    async create(metBook) {
      if (!app.config.isMeetingAvailable) return app.config.ERROR.MEETING.INVALID;
      const meeting = await app.model.Meeting.findOne({ _id: metBook.meeting });
      if (!meeting) return app.config.ERROR.MEETING.NOEXIST;
      if (!meeting.enable) return app.config.ERROR.MEETING.INVALID;
      const metBooksNum = await app.model.Metbook.count({ user: metBook.user, cond: { $lt: 2 } });
      if (metBooksNum >= app.config.maxMetBooks) return app.config.ERROR.METBOOK.INSUFFI;
      for (const time of metBook.books) {
        if (meeting.times.indexOf(time) === -1) return app.config.ERROR.MEETING.WRTIME;
        const isBook = await app.model.Metbook.findOne({ date: metBook.date, books: time, cond: { $lt: 2 } });
        if (isBook) return app.config.ERROR.MEETING.INSUFFI;
      }
      if (!meeting.proj) metBook.proj = false;
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
