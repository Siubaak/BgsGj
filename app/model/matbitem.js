'use strict';

module.exports = app => {
  const MatbItemSchema = new app.mongoose.Schema({
    user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    material: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'Material' },
    matBook: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'Matbook' },
    book: { type: Number, default: 0 },
    cond: { type: Number, enum: [ 0, 1, 2, 3 ], default: 0 }, // 0为预约，1为借出，2为归还，3为作废
    creator: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    created: { type: Date, required: true },
    updator: { type: app.mongoose.Schema.Types.ObjectId, ref: 'User' },
    updated: Date,
  });
  return app.mongoose.model('Matbitem', MatbItemSchema);
};
