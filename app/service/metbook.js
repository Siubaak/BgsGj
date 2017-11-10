'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ user, skip = 0, limit = 0 }) {
      return await (() => {
        switch (user) {
          case undefined:
            return app.model.Metbook.find();
          case 'back':
            return app.model.Metbook.find({ cond: 0 });
          default:
            return app.model.Metbook.find({ user, cond: 0 });
        }
      })().populate('user', 'account').sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
    }
    async findById(id) {
      return await app.model.Metbook.findById(id) || {};
    }
    async getUsage() {
      const metBooks = await app.model.Metbook.find({ cond: 0 });
      const times = {};
      metBooks.forEach(metBook => { times[`${metBook.date}${metBook.time}`] = true; });
      return times;
    }
    async create(metBook) {
      const isBook = await app.model.Metbook.findOne({ date: metBook.date, time: metBook.time, cond: 0 });
      if (!isBook) {
        const metBooksNum = await app.model.Metbook.count({ user: metBook.user, cond: 0 });
        if (metBooksNum < app.config.maxMetBooks) return app.model.Metbook.create(metBook);
      }
      return null;
    }
    async update(metBook) {
      this.ctx.helper.delProps(metBook, [ 'user', 'date', 'time' ]);
      return await app.model.Metbook.findOneAndUpdate({ _id: metBook._id }, { $set: metBook }, { new: true });
    }
    async updateCond({ id, cond }) {
      return await app.model.Metbook.update({ _id: id }, { $set: { cond } });
    }
    async updateSchdl(today) {
      return await app.model.Metbook.update({ date: today, cond: 0 }, { $set: { cond: 2 } }, { multi: true });
    }
    async removeById(_id) {
      return await app.model.Metbook.remove({ _id });
    }
  };
};
