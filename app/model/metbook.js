'use strict';

module.exports = app => {
  const MetbookSchema = new app.mongoose.Schema({
    user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    activity: String,
    date: { type: String, required: true }, // 格式YYYY年MM月DD日
    time: { type: String, required: true }, // 如中午12:30-14:00，下午17:30-19:00
    isPNeed: { type: Boolean, default: false }, // 是否需要投影仪
    cond: { type: Number, enum: [ 0, 2, 3 ], default: 0 }, // 0为预约，1为借出，2为归还，3为作废，会议室预约无借出状态
  });
  return app.mongoose.model('Metbook', MetbookSchema);
};
