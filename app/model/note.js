'use strict';

module.exports = app => {
  const NoteSchema = new app.mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    created: { type: Date, required: true },
    updator: { type: app.mongoose.Schema.Types.ObjectId, ref: 'User' },
    updated: Date,
  });
  return app.mongoose.model('Note', NoteSchema);
};
