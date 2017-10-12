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
    cond: { type: String, enum: [ '预约', '归还', '作废' ] },
  });
  return app.mongoose.model('Metbook', MetbookSchema);
};
