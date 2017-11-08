'use strict';

module.exports = app => {
  const MatbookSchema = new app.mongoose.Schema({
    user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    activity: String,
    sum: { type: Number, default: 0 },
    takeDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    remark: String,
    cond: { type: Number, enum: [ 0, 1, 2, 3 ], default: 0 }, // 0为预约，1为借出，2为归还，3为作废
    creator: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    created: { type: Date, required: true },
    updator: { type: app.mongoose.Schema.Types.ObjectId, ref: 'User' },
    updated: Date,
  });
  return app.mongoose.model('Matbook', MatbookSchema);
};
