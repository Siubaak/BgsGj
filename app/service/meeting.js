'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ enable = false, skip = 0, limit = 0, date}) {
      let metBooks;
      if (typeof date === 'string') {
        metBooks = await app.model.Metbook.find({ date, cond: { $lt: 2 } });
      }
      let query;
      if (enable) query = { enable: true };
      const list = await app.model.Meeting.find(query)
        .skip(skip)
        .limit(limit);
      if (metBooks) {
        const meetingObj = {};
        for (const metBook of metBooks) {
          if (!meetingObj[metBook.meeting]) {
            meetingObj[metBook.meeting] = {}
          }
          for (const book of metBook.books) {
            meetingObj[metBook.meeting][book] = true;
          }
        }
        for (const meeting of list) {
          if (meetingObj[meeting._id]) {
            meeting.times = meeting.times.filter(time => !meetingObj[meeting._id][time])
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
      const meetings = await app.model.Meeting.find({ enable: true });
      meetings.forEach(meeting =>
        await app.model.Metbook.update({ meeting: meeting._id, date: today, cond: { $lt: 2 } }, { $set: { cond: 2 } }, { multi: true })
      )
    }
  };
};
