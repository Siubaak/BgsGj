'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.Metbook.count();
    }
    async find({ user, skip = 0, limit = 0 }) {
      let model;
      switch (user) {
        case undefined:
          model = app.model.Metbook.find();
          break;
        case 'back':
          model = app.model.Metbook.find({ cond: { $lt: 2 } });
          break;
        default:
          model = app.model.Metbook.find({ user, cond: { $lt: 2 } });
      }
      return await model
        .populate('user', 'account')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
    }
    async findById(id) {
      return await app.model.Metbook.findById(id).populate('user', 'account') || {};
    }
    async create(metBook) {
      const metBooksNum = await app.model.Metbook.count({ user: metBook.user, cond: { $lt: 2 } });
      if (metBooksNum >= app.config.maxMetBooks) return app.config.ERROR.METBOOK.INSUFFI;
      const isBook = await app.model.Metbook.findOne({ date: metBook.date, time: metBook.time, cond: { $lt: 2 } });
      if (isBook) return app.config.ERROR.MEETING.INSUFFI;
      return app.model.Metbook.create(metBook);
    }
    async update(metBook) {
      this.ctx.helper.delProps(metBook, [ 'user', 'date', 'time' ]);
      if (metBook.cond) {
        const metB = await app.model.Metbook.findById(metBook._id);
        if (!metB) return app.config.ERROR.METBOOK.NOEXIST;
        if (metB.cond > metBook.cond) return app.config.ERROR.METBOOK.INVALID;
      }
      return await app.model.Metbook.findOneAndUpdate({ _id: metBook._id }, { $set: metBook }, { new: true });
    }
    async removeById(_id) {
      return await app.model.Metbook.remove({ _id });
    }
  };
};
