'use strict';

module.exports = app => {
  return class extends app.Service {
    async find({ skip = 0, limit = 0 }) {
      return await app.model.Note.find().skip(skip).limit(limit);
    }
    async findById(id) {
      return await app.model.Note.findById(id);
    }
    async findByTitle(title) {
      return await app.model.Note.findOne({ title });
    }
    async create(note) {
      return await app.model.Note.create(note);
    }
    async update(note) {
      return await app.model.Note.update({ _id: note._id }, { $set: note });
    }
    async removeById(_id) {
      return await app.model.Note.remove({ _id });
    }
  };
};
