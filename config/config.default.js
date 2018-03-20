'use strict';
const setCusConfig = require('./config');

module.exports = appInfo => {
  const config = exports = {};

  setCusConfig(config);

  config.keys = appInfo.name + '_1506565858794_5840';
  config.middleware = [ 'errhandler' ];
  config.security = { csrf: { ignoreJSON: true } };
  // API服务器挂载路径，默认为根目录
  config.prefix = '';
  // 常用错误状态
  config.ERROR = {
    USER: {
      NOEXIST: { err: '00', msg: '用户不存在' },
      INSUFFI: { err: '01', msg: '余额不足' },
      INVALID: { err: '02', msg: '非法操作' },
      WPASSWD: { err: '03', msg: '密码错误' },
      NOPERM: { err: '04', msg: '权限不足' },
      EXPIRY: { err: '05', msg: '授权过期' },
    },
    NOTE: {
      NOEXIST: { err: '10', msg: '用户不存在' },
    },
    MATERIAL: {
      NOEXIST: { err: '20', msg: '物资不存在' },
      INSUFFI: { err: '21', msg: '数量不足' },
      INVALID: { err: '22', msg: '物资暂停借用' },
    },
    MATBOOK: {
      NOEXIST: { err: '30', msg: '申请不存在' },
      INSUFFI: { err: '31', msg: '次数已满' },
      INVALID: { err: '32', msg: '非法状态更新' },
    },
    MEETING: {
      NOEXIST: { err: '40', msg: '会议室不存在' },
      INSUFFI: { err: '41', msg: '时间段已被预约' },
      INVALID: { err: '42', msg: '会议室暂停预约' },
      WRTIME: { err: '43', msg: '非法时间段' },
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
