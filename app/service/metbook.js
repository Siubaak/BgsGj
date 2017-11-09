'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ user, skip = 0, limit = 0 }) {
      return await (() => {
        switch (user) {
          case undefined:
            return app.model.Metbook.find();
          case 'back':
            return app.model.Metbook.find({ cond: '预约' });
          default:
            return app.model.Metbook.find({ user, cond: '预约' });
        }
      })().populate('user', 'account').sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
    }
    async findById(id) {
      return await app.model.Metbook.findById(id) || {};
    }
    async getUsage() {
      const metBooks = await app.model.Metbook.find({ cond: '预约' });
      const times = {};
      metBooks.forEach(metBook => { times[`${metBook.date}${metBook.time}`] = true; });
      return times;
    }
    async create(metBook) {
      const isBook = await app.model.Metbook.findOne({ date: metBook.date, time: metBook.time, cond: '预约' });
      if (!isBook) {
        const metBooksNum = await app.model.Metbook.count({ user: metBook.user, cond: '预约' });
        if (metBooksNum < app.config.maxMetBooks) return app.model.Metbook.create(metBook);
      }
      return false;
    }
    async update(metBook) {
      return await app.model.Metbook.update({ _id: metBook._id }, { $set: metBook });
    }
    async updateCond({ id, cond }) {
      return await app.model.Metbook.update({ _id: id }, { $set: { cond } });
    }
    async updateSchdl(today) {
      return await app.model.Metbook.update({ date: today, cond: '预约' }, { $set: { cond: '归还' } }, { multi: true }).exec();
    }
    async removeById(_id) {
      return await app.model.Metbook.remove({ _id });
    }
  };
};
