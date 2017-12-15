'use strict';

module.exports = appInfo => {
  const config = exports = {};

  /**
   * 用户配置
   */
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
  // 会议室是否开放、投影仪是否能用
  config.isMeetingAvailable = true;
  config.isProjAvailable = true;
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

  /**
   * 服务器配置，勿动
   */
  config.keys = appInfo.name + '_1506565858794_5840';
  config.middleware = [ 'errhandler' ];
  config.security = { csrf: { ignoreJSON: true } };
  // 挂载路径，默认为/api
  config.prefix = '/api';
  // 常用错误状态
  config.ERROR = {
    USER: {
      NOEXIST: { err: '00', msg: '用户不存在' },
      INSUFFI: { err: '01', msg: '余额不足' },
      WPASSWD: { err: '02', msg: '密码错误' },
      NOPERM: { err: '03', msg: '权限不足' },
      EXPIRY: { err: '04', msg: '授权过期' },
      INVALID: { err: '05', msg: '非法操作' },
    },
    NOTE: {
      NOEXIST: { err: '10', msg: '用户不存在' },
    },
    MATERIAL: {
      NOEXIST: { err: '20', msg: '物资不存在' },
      INSUFFI: { err: '21', msg: '数量不足' },
    },
    MATBOOK: {
      NOEXIST: { err: '30', msg: '申请不存在' },
      INSUFFI: { err: '31', msg: '次数已满' },
      INVALID: { err: '32', msg: '非法状态更新' },
    },
    MEETING: {
      NOEXIST: { err: '40', msg: '会议室不开放' },
      INSUFFI: { err: '41', msg: '时间段已被预约' },
    },
    METBOOK: {
      NOEXIST: { err: '50', msg: '预约不存在' },
      INSUFFI: { err: '51', msg: '次数已满' },
      INVALID: { err: '52', msg: '非法状态更新' },
    },
    SERVER: {
      NOTFUND: { err: '60', msg: '非法路径' },
      BADREQ: { err: '61', msg: '参数错误' },
      INERROR: { err: '62', msg: '服务器错误' },
    },
  };
  return config;
};
