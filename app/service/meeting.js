'use strict';

module.exports = app => {
  return class extends app.Service {
    async find() {
      const result = {};
      const metBooks = await app.model.Metbook.find({ cond: { $lt: 2 } });
      metBooks.forEach(metBook => { result[`${metBook.date}${metBook.time}`] = true; });
      return result;
    }
    async settings() {
      return {
        enable: app.config.isMeetingAvailable,
        proj: app.config.isProjAvailable,
      };
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
