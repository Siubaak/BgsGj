'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ enable = false, skip = 0, limit = 0, date }) {
      let metBooks;
      if (typeof date === 'string') {
        metBooks = await app.model.Metbook.aggregate([
          { $match: { date, cond: { $lt: 2 } } },
          { $project: { meeting: 1, books: 1 } },
          { $unwind: '$books' },
          { $group: { _id: '$meeting', books: { $push: '$books' } } },
        ]);
        metBooks = this.ctx.helper.arr2Obj(metBooks, '_id', 'books');
      }
      let query;
      if (enable) query = { enable: true };
      const list = await app.model.Meeting.find(query)
        .skip(skip)
        .limit(limit);
      if (metBooks) {
        for (const meeting of list) {
          if (metBooks[meeting._id]) {
            meeting.times = meeting.times.filter(time => metBooks[meeting._id].indexOf(time) === -1);
          }
        }
      }
      const total = await app.model.Meeting.count(query);
      return { total, list };
    }
    async findById(id) {
      return await app.model.Meeting.findById(id) || {};
    }
    async settings() {
      return { gEnable: app.config.isMeetingAvailable };
    }
    async create(meeting) {
      return await app.model.Meeting.create(meeting);
    }
    async update(meeting) {
      return await app.model.Meeting.findOneAndUpdate({ _id: meeting._id }, { $set: meeting }, { new: true });
    }
    async removeById(_id) {
      return await Promise.all([
        app.model.Meeting.remove({ _id }),
        app.model.Metbook.remove({ meeting: _id }),
      ]);
    }
    async schedule(today) {
      const meetings = await app.model.Meeting.find();
      for (const meeting of meetings) {
        await app.model.Metbook.update({
          meeting: meeting._id,
          date: today,
          cond: { $lt: 2 },
        }, { $set: { cond: 2 } }, { multi: true });
      }
    }
  };
};
