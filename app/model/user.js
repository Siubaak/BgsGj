'use strict';

module.exports = app => {
  const UserSchema = new app.mongoose.Schema({
    account: { type: String, required: true },
    password: { type: String, required: true },
    // 用户钱包，管理员可设置为零
    wallet: { type: Number, default: 0 },
    // 权限分级，0为未审核用户，1为已审核研分会用户，2为已审核研会用户，3为普通管理员，4为超级管理员
    level: { type: Number, default: 0 },
    reName: String, // 账号负责人姓名
    rePhone: String, // 账号负责人电话
    created: Date,
    lastSeen: Date,
  });
  return app.mongoose.model('User', UserSchema);
};
