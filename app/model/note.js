'use strict';

module.exports = app => {
  const NoteSchema = new app.mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    updated: { type: Date, required: true },
  });
  return app.mongoose.model('Note', NoteSchema);
};
