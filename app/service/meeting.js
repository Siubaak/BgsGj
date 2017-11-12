'use strict';

module.exports = app => {
  return class extends app.Service {
    async find() {
      const times = {};
      const metBooks = await app.model.Metbook.find({ cond: { $lt: 2 } });
      metBooks.forEach(metBook => { times[`${metBook.date}-${metBook.time}`] = true; });
      times.isProjAvailable = app.config.isProjAvailable;
      return times;
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
