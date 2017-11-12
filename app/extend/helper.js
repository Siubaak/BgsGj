'use strict';

const crypto = require('crypto');

module.exports = {
  sha1(key) {
    const sha1 = crypto.createHash('sha1');
    return sha1.update(key).digest('hex');
  },
  arr2Obj(arr, key, val) {
    const result = {};
    for (const obj of arr) result[obj[key]] = obj[val];
    return result;
  },
  delProps(obj, keys) {
    for (const key of keys) delete obj[key];
  },
};
