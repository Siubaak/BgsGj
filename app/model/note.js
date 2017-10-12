'use strict';

module.exports = app => {
  const NoteSchema = new app.mongoose.Schema({
    body: { type: String, required: true },
  });
  return app.mongoose.model('Note', NoteSchema);
};
