'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.Note.count();
    }
    async find({ skip = 0, limit = 0 }) {
      const list = await app.model.Note.find().skip(skip).limit(limit);
      const total = await app.model.Note.count();
      return { total, list };
    }
    async findById(id) {
      return await app.model.Note.findById(id) || {};
    }
    async findByTitle(title) {
      return await app.model.Note.findOne({ title }) || {};
    }
    async create(note) {
      return await app.model.Note.create(note);
    }
    async update(note) {
      return await app.model.Note.findOneAndUpdate({ _id: note._id }, { $set: note }, { new: true });
    }
    async removeById(_id) {
      return await app.model.Note.remove({ _id });
    }
  };
};
