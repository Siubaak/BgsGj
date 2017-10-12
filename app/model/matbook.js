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
    cond: { type: String, enum: [ '预约', '借出', '归还', '作废' ] },
  });
  return app.mongoose.model('Matbook', MatbookSchema);
};
