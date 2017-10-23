# BgsGj

[![](https://img.shields.io/travis/Siubaak/BgsGj.svg?style=flat-square)](https://travis-ci.org/Siubaak/BgsGj)

华南理工大学研究生会小管家RESTful API服务器项目

## RESTful API列表

通用查询或请求体参数含义说明

| 参数      | 说明               |
| -------- | ------------------ |
| id       | 资源id，类型为字符串  |
| skip     | 跳过资源数，类型为数值 |
| limit    | 获取资源数，类型为数值 |

未说明参数的含义详见下方数据结构

### tokens资源 /api/tokens

| HTTP动词 | 查询参数 | 请求体参数         |
| ------- | ------- | ----------------- |
| post    | 无      | account, password |

### users资源 /api/users

| HTTP动词 | 查询参数 | 请求体参数         |
| ------- | ------- | ----------------- |
| get     | id, account, skip, limit      | 无 |
|      | id, account, skip, limit      | 无 |

## 数据结构（Model Schema）

```js
// 通知
note: {
  title: { type: String, required: true },  // 通知标题
  content: { type: String, required: true },  // 通知内容
}
// 用户
user: {
  account: { type: String, required: true },  // 用户账号，对于部门用户为部门名称
  password: { type: String, required: true }, // 用户密码
  wallet: { type: Number, default: 0 }, // 用户钱包，管理员用户可设置为零
  // 权限分级，0为未审核用户，1为已审核研分会用户，2为已审核研会用户，3为普通管理员，4为超级管理员
  level: { type: Number, enum: [ 0, 1, 2, 3, 4 ], default: 0 },
  reName: String, // 账号负责人姓名
  rePhone: String, // 账号负责人电话
  created: Date,  // 用户常见时间
  lastSeen: Date, // 用户最后登录时间
}
// 物资
material: {
  type: { type: String, required: true }, // 物资类型
  name: { type: String, required: true }, // 物资名称
  quantity: { type: Number, default: 0 }, // 物资数量
  unit: { type: String, default: '个' }, // 物资单位
  price: { type: Number, default: 0 },  // 物资价格
}
// 物资申请
matbook: {
  // 用户ID
  user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true }, // 申请人姓名
  phone: { type: String, required: true },  // 申请人手机
  activity: String, // 活动名称
  sum: { type: Number, default: 0 },  // 物资总价
  takeDate: { type: Date, required: true }, // 领取日期
  returnDate: { type: Date, required: true }, // 归还日期
  remark: String, // 备注
  // 物资申请状态
  cond: { type: String, enum: [ '预约', '借出', '归还', '作废' ], default: '预约' },
}
// 物资申请单项物资
matbitem: {
  // 用户ID
  user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  // 物资ID
  material: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'Material' },
  // 归属物资申请ID
  matBook: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'Matbook' },
  book: { type: Number, default: 0 }, // 申请数量
  // 物资申请状态
  cond: { type: String, enum: [ '预约', '借出', '归还', '作废' ], default: '预约' },
}
// 会议室预约
metbook: {
  // 用户ID
  user: { type: app.mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true }, // 申请人姓名
  phone: { type: String, required: true },  // 申请人手机
  activity: String, // 会议名称
  date: { type: String, required: true }, // 预约日期，格式YYYY年MM月DD日
  time: { type: String, required: true }, // 预约时间段，如中午12:30-14:00，下午17:30-19:00
  isPNeed: { type: Boolean, default: false }, // 是否需要投影仪
  // 会议室预约状态
  cond: { type: String, enum: [ '预约', '归还', '作废' ], default: '预约' },
}
```