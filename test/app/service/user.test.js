'use strict';

const { app, assert } = require('egg-mock/bootstrap');
let id;

describe('test/app/service/user.test.js', () => {
  it('should have no users', async () => {
    await app.model.User.remove();
    const result = await app.model.User.count();
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
    result = await app.model.User.count();
    assert(result === 4);
  });

  it('should find normally', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.user.find({});
    assert(result.list.length === 4 && !result.list[0].password);
    result = await ctx.service.user.find({ all: false });
    assert(result.list.length === 3 && !result.list[0].password);
    result = await ctx.service.user.find({ all: false, skip: 1 });
    assert(result.list.length === 2 && !result.list[0].password);
    result = await ctx.service.user.find({ all: false, limit: 1 });
    assert(result.list.length === 1 && !result.list[0].password);
    result = await ctx.service.user.find({ all: false, skip: 1, limit: 1 });
    assert(result.list.length === 1 && result.list[0]._id.toString() === id && !result.list[0].password);
    result = await ctx.service.user.findById(id);
    assert(result && result.account === 'test1' && !result.password);
    result = await ctx.service.user.findByAccount('test1');
    assert(result && result._id.toString() === id && !result.password);
  });

  it('should update normally', async () => {
    const ctx = app.mockContext();
    const result = await ctx.service.user.update({
      _id: id,
      phone: '13843278098',
    });
    assert(result && result.phone === '13843278098');
  });

  it('should remove normally', async () => {
    const ctx = app.mockContext();
    await ctx.service.user.removeById(id);
    let result = await app.model.User.count();
    assert(result === 3);
    await app.model.User.remove();
    result = await app.model.User.count();
    assert(result === 0);
  });
});
