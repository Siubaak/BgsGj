'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ settings = false }) {
      const result = {};
      if (settings) {
        result.enable = app.config.isMeetingAvailable;
        result.proj = app.config.isProjAvailable;
      } else {
        const metBooks = await app.model.Metbook.find({ cond: { $lt: 2 } });
        metBooks.forEach(metBook => { result[`${metBook.date}${metBook.time}`] = true; });
      }
      return result;
    }
    async update(meeting) {
      app.config.isMeetingAvailable = meeting.enable;
      app.config.isProjAvailable = meeting.proj;
    }
    async schedule(today) {
      return await app.model.Metbook.update({ date: today, cond: { $lt: 2 } }, { $set: { cond: 2 } }, { multi: true });
    }
  };
};
