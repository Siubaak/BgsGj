'use strict';

module.exports = app => {
  return class extends app.Service {
    async count() {
      return await app.model.Note.count();
    }
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
      note.creator = this.ctx.state.user._id;
      note.created = new Date();
      const newNote = await app.model.Note.create(note);
      this.ctx.logger.info(`[note] ${note.creator} created a note - ${newNote._id}`);
      return newNote;
    }
    async update(note) {
      note.updator = this.ctx.state.user._id;
      note.updated = new Date();
      const result = await app.model.Note.update({ _id: note._id }, { $set: note });
      this.ctx.logger.info(`[note] ${note.updator} updated a note - ${note._id}`);
      return result;
    }
    async removeById(_id) {
      const result = await app.model.Note.remove({ _id });
      this.ctx.logger.info(`[note] ${this.ctx.state.user._id} removed a note - ${_id}`);
      return result;
    }
  };
};
