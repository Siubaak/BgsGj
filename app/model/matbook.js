'use strict';

module.exports = app => {
  const MatbookSchema = new app.mongoose.Schema({
    user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    activity: String,
    price: { type: Number, min: 0, default: 0 },
    takeDate: { type: String, required: true }, // 格式YYYY-MM-DD
    returnDate: { type: String, required: true }, // 格式YYYY-MM-DD
    remark: String,
    cond: { type: Number, max: 3, default: 0 }, // 0为预约，1为借出，2为归还，3为作废
    materials: [{
      material: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'Material' },
      book: { type: Number, min: 0, default: 0 },
    }],
  });
  return app.mongoose.model('Matbook', MatbookSchema);
};
