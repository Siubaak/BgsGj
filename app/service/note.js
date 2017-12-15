'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.Note.count();
    }
    async find({ enable = false, skip = 0, limit = 0 }) {
      let query;
      if (enable) query = { enable: true };
      const list = await app.model.Note
        .find(query)
        .sort({ updated: -1 })
        .skip(skip)
        .limit(limit);
      const total = await app.model.Note.count(query);
      return { total, list };
    }
    async findById(id) {
      return await app.model.Note.findById(id) || {};
    }
    async findByTitle(title) {
      return await app.model.Note.findOne({ title }) || {};
    }
    async create(note) {
      note.updated = Date.now();
      return await app.model.Note.create(note);
    }
    async update(note) {
      note.updated = Date.now();
      return await app.model.Note.findOneAndUpdate({ _id: note._id }, { $set: note }, { new: true });
    }
    async removeById(_id) {
      return await app.model.Note.remove({ _id });
    }
  };
};
