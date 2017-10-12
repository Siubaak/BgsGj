'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/token.test.js', () => {
  it('should not create any tokens', async () => {
    const ctx = app.mockContext();
    const token = await ctx.service.token.create({ account: 'test', password: 'test' });
    assert(typeof token !== 'string' && token === null);
  });
  it('should create a token', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.user.create({ account: 'test', password: 'test' });
    assert(typeof result === 'object');

    const token = await ctx.service.token.create({ account: 'test', password: 'test' });
    assert(typeof token === 'string' && token);

    await app.model.User.remove();
    result = await ctx.service.user.find({});
    assert(result.length === 0);
  });
});
