'use strict';

module.exports = app => {
  const MeetingSchema = new app.mongoose.Schema({
    name: { type: String, required: true }, // 会议室名称
    times: [{ type: String, required: true }], // 开放时间
    proj: { type: Boolean, default: true }, // 是否允许使用投影仪
    enable: { type: Boolean, default: true },
  });
  return app.mongoose.model('Meeting', MeetingSchema);
};
