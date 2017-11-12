'use strict';

const { app, assert } = require('egg-mock/bootstrap');
let id;

describe('test/app/service/user.test.js', () => {
  it('should have no users', async () => {
    const ctx = app.mockContext();
    await app.model.User.remove();
    const result = await ctx.service.user.count();
    assert(result === 0);
  });

  it('should create normally', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.user.create({ account: 'test0', password: 'test0' });
    assert(result && result._id);
    result = await ctx.service.user.create({ account: 'test1', password: 'test1' });
    assert(result && result._id);
    id = result._id.toString();
    result = await ctx.service.user.create({ account: 'test2', password: 'test2' });
    assert(result && result._id);
    result = await ctx.service.user.create({ account: 'test2', password: 'test2', level: 4 });
    assert(result && result._id);
    result = await ctx.service.user.count();
    assert(result === 4);
  });

  it('should find normally', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.user.find({});
    assert(result.length === 3 && !result[0].password);
    result = await ctx.service.user.find({ skip: 1 });
    assert(result.length === 2 && !result[0].password);
    result = await ctx.service.user.find({ limit: 1 });
    assert(result.length === 1 && !result[0].password);
    result = await ctx.service.user.find({ skip: 1, limit: 1 });
    assert(result.length === 1 && result[0]._id.toString() === id && !result[0].password);
    result = await ctx.service.user.findById(id);
    assert(result && result.account === 'test1' && !result.password);
    result = await ctx.service.user.findByAccount('test1');
    assert(result && result._id.toString() === id && !result.password);
  });

  it('should update normally', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.user.update({
      id,
      password: 'test0',
      user: { _id: id, rePhone: '13843278098' },
    });
    assert(result === app.config.ERROR.USER.INVALID);
    result = await ctx.service.user.update({
      id,
      password: 'test1',
      user: { _id: id, rePhone: '13843278098' },
    });
    assert(result && result.rePhone === '13843278098');
  });

  it('should remove normally', async () => {
    const ctx = app.mockContext();
    await ctx.service.user.removeById(id);
    let result = await ctx.service.user.count();
    assert(result === 3);
    await app.model.User.remove();
    result = await ctx.service.user.count();
    assert(result === 0);
  });
});
