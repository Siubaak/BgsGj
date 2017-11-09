'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const sha1 = require('../../../lib/sha1');

describe('test/app/service/token.test.js', () => {
  it('should have no users', async () => {
    await app.model.User.remove();
    const result = await app.model.User.count();
    assert(result === 0);
  });

  it('should not create any tokens', async () => {
    const ctx = app.mockContext({ state: { user: { id: '5a014b4ef5ea8e590f0d31da' } } });
    let token = await ctx.service.token.create({ account: 'test', password: 'test' });
    assert(typeof token !== 'string' && token === null);
    const result = await app.model.User.create({
      account: 'test',
      password: sha1('test'),
    });
    assert(typeof result === 'object' && result._id);
    token = await ctx.service.token.create({ account: 'test', password: 'test0' });
    assert(typeof token !== 'string' && token === null);
  });

  it('should create a token', async () => {
    const ctx = app.mockContext({ state: { user: { id: '5a014b4ef5ea8e590f0d31da' } } });
    const token = await ctx.service.token.create({ account: 'test', password: 'test' });
    assert(typeof token === 'string' && token);
    await app.model.User.remove();
    const result = await app.model.User.count();
    assert(result === 0);
  });
});
