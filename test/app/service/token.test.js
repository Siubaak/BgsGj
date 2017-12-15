'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/token.test.js', () => {
  it('should have no users', async () => {
    await app.model.User.remove();
    const result = await app.model.User.count();
    assert(result === 0);
  });

  it('should not create any tokens', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.token.create({ account: 'test', password: 'test' });
    assert(result === app.config.ERROR.USER.NOEXIST);
    result = await app.model.User.create({
      account: 'test',
      password: ctx.helper.sha1('test'),
    });
    assert(result && result._id);
    result = await ctx.service.token.create({ account: 'test', password: 'test0' });
    assert(result === app.config.ERROR.USER.WPASSWD);
  });

  it('should create a token', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.token.create({ account: 'test', password: 'test' });
    assert(result && typeof result.token === 'string' && result.token);
    await app.model.User.remove();
    result = await app.model.User.count();
    assert(result === 0);
  });
});
