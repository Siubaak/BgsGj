'use strict';

module.exports = app => {
  const MatbItemSchema = new app.mongoose.Schema({
    user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    material: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'Material' },
    matBook: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'Matbook' },
    book: { type: Number, default: 0 },
    cond: { type: String, enum: [ '预约', '借出', '归还', '作废' ], default: '预约' },
  });
  return app.mongoose.model('Matbitem', MatbItemSchema);
};
