'use strict';

module.exports = app => {
  const MetbookSchema = new app.mongoose.Schema({
    user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    activity: String,
    meeting: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'Meeting' },
    date: { type: String, required: true }, // 格式YYYY-MM-DD
    books: [{ type: String, required: true }], // 如12:00-13:00，15:00-16:00
    proj: { type: Boolean, default: false }, // 是否需要投影仪
    cond: { type: Number, max: 3, default: 0 }, // 0为预约，1为借出，2为归还，3为作废
  });
  return app.mongoose.model('Metbook', MetbookSchema);
};
