'use strict';

const crypto = require('crypto');

module.exports = {
  sha1(key) {
    const sha1 = crypto.createHash('sha1');
    return sha1.update(key).digest('hex');
  },
};
