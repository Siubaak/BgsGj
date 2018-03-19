'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const uId = [];
let matId;
let matbId;

describe('test/app/service/matbook.test.js', () => {
  it('should have no material books', async () => {
    await app.model.Matbook.remove();
    let result = await app.model.Matbook.count();
    assert(result === 0);
    await app.model.Material.remove();
    result = await app.model.Material.count();
    assert(result === 0);
    await app.model.User.remove();
    result = await app.model.User.count();
    assert(result === 0);
  });

  it('should create normally', async () => {
    const ctx = app.mockContext();
    let result = await app.model.User.create({
      account: 'test0',
      password: 'test0',
      wallet: 8,
    });
    assert(result && result._id);
    uId.push(result._id.toString());
    result = await app.model.Material.create({
      type: 'office',
      name: 'pen',
      quantity: 10,
      unit: 'pcs',
      price: 1,
    });
    assert(result && result._id);
    matId = result._id.toString();
    // 正常租借申请
    result = await ctx.service.matbook.create({
      user: uId[0],
      name: 'matBook0',
      phone: '13600000000',
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      materials: [{ material: matId, book: 5 }],
    });
    assert(result && result._id);
    matbId = result._id;
    result = await ctx.service.matbook.findById(result._id);
    assert(result && result.price === 5);
    result = await app.model.User.findById(uId[0]);
    assert(result && result.wallet === 3);
    // 用户钱包余额不足，无法租借
    result = await ctx.service.matbook.create({
      user: uId[0],
      name: 'matBook1',
      phone: '13611111111',
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      materials: [{ material: matId, book: 5 }],
    });
    assert(result === app.config.ERROR.USER.INSUFFI);
    // 添加用户钱包余额
    await app.model.User.update({ _id: uId[0] }, { $set: { wallet: 10 } });
    // 正常租借申请，并借光所有物品
    result = await ctx.service.matbook.create({
      user: uId[0],
      name: 'matBook2',
      phone: '13622222222',
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      materials: [{ material: matId, book: 5 }],
    });
    assert(result && result._id);
    result = await ctx.service.matbook.findById(result._id);
    assert(result && result.price === 5);
    result = await app.model.User.findById(uId[0]);
    assert(result && result.wallet === 5);
    // 物品总量不足，无法租借
    result = await ctx.service.matbook.create({
      user: uId[0],
      name: 'matBook3',
      phone: '13611111111',
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      materials: [{ material: matId, book: 1 }],
    });
    assert(result === app.config.ERROR.MATERIAL.INSUFFI);
    // 添加物品总量
    await app.model.Material.update({ _id: matId }, { $inc: { quantity: app.config.maxMatBooks } });
    // 连续购买，达到最大购买次数,已有两次
    for (let i = 0; i < app.config.maxMatBooks - 2; i++) {
      result = await ctx.service.matbook.create({
        user: uId[0],
        name: `fillBook${i}`,
        phone: '13500000000',
        takeDate: '2017-01-01',
        returnDate: '2017-01-03',
        materials: [{ material: matId, book: 1 }],
      });
      assert(result && result._id);
    }
    // 用户最大申请次数达到，无法提交申请
    result = await ctx.service.matbook.create({
      user: uId[0],
      name: 'matBook',
      phone: '13700000000',
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      materials: [{ material: matId, book: 1 }],
    });
    assert(result === app.config.ERROR.MATBOOK.INSUFFI);
  });

  it('should find normally', async () => {
    const ctx = app.mockContext();
    let result = await app.model.User.create({
      account: 'test0',
      password: 'test0',
      wallet: 2,
    });
    assert(result && result._id);
    uId.push(result._id.toString());
    result = await ctx.service.matbook.create({
      user: uId[1],
      name: 'newBook0',
      phone: '13500000000',
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      materials: [{ material: matId, book: 1 }],
    });
    assert(result && result._id);
    result = await ctx.service.matbook.create({
      user: uId[1],
      name: 'newBook1',
      phone: '13500000000',
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      cond: 3,
      materials: [{ material: matId, book: 1 }],
    });
    assert(result && result._id);
    result = await ctx.service.matbook.find({});
    assert(result.list.length === 6 && result.list[0].name === 'newBook0');
    result = await ctx.service.matbook.find({ limit: 1 });
    assert(result.list.length === 1 && result.list[0].name === 'newBook0');
    result = await ctx.service.matbook.find({ skip: 1 });
    assert(result.list.length === 5 && result.list[0].name === 'fillBook1');
    result = await ctx.service.matbook.find({ user: 'back' });
    assert(result.list.length === 5 && result.list[0].name === 'newBook0');
    result = await ctx.service.matbook.find({ user: uId[1] });
    assert(result.list.length === 1 && result.list[0].name === 'newBook0');
  });

  it('should update normally', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.matbook.update({
      _id: matbId,
      cond: 3,
    });
    assert(result && result.cond === 3);
    result = await app.model.User.findById(uId[0]);
    assert(result && result.wallet === 8);
    result = await ctx.service.matbook.update({
      _id: matbId,
      cond: 2,
    });
    assert(result === app.config.ERROR.MATBOOK.INVALID);
  });

  it('should remove normally', async () => {
    const ctx = app.mockContext();
    await ctx.service.matbook.removeById(matbId);
    let result = await app.model.Matbook.count();
    assert(result === 5);
    await app.model.Matbook.remove();
    result = await app.model.Matbook.count();
    assert(result === 0);
    await app.model.Material.remove();
    result = await app.model.Material.count();
    assert(result === 0);
    await app.model.User.remove();
    result = await app.model.User.count();
    assert(result === 0);
  });
});
