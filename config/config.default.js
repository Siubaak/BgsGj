'use strict';

module.exports = appInfo => {
  const config = exports = {};
  config.keys = appInfo.name + '_1506565858794_5840';
  config.middleware = [];

  // 数据库配置
  config.mongoose = {
    url: 'mongodb://127.0.0.1/bgs',
  };
  // JWT密钥
  config.jwtSecret = 'test';
  // 用户默认密码
  config.usrDePass = '123456';
  // 用户及管理员token过期天数
  config.expiry = 14;
  // 允许最大物资申请及会议室预约数量
  config.maxMatBooks = 4;
  config.maxMetBooks = 4;
  // 投影仪是否能用
  config.isPAvailable = true;
  // 每天处理会议室归还时间，六个数字格式如下
  // 秒（0-59，可选） 分（0-59） 时（0-23） 日期（1-31） 月份（1-12） 星期（0-7，0或7均为星期天）
  // 其中*为任意或者所有
  config.schedule = '0 0 23 * * *';
  // 邮件通知设置，smtp地址、端口（一般为465）、用户名、第三方登录密码、通知邮箱
  config.mail = {
    host: 'smtp.163.com',
    port: 465,
    user: 'test@163.com',
    password: 'test',
    to: 'test@163.com',
  };
  return config;
};
