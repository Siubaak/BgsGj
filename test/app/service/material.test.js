'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const id = [];

describe('test/app/service/material.test.js', () => {
  it('should have no materials', async () => {
    const ctx = app.mockContext();
    await app.model.Matbook.remove();
    let result = await app.model.Matbook.count();
    assert(result === 0);
    await app.model.Material.remove();
    result = await ctx.service.material.count();
    assert(result === 0);
  });

  it('should create normally', async () => {
    const ctx = app.mockContext();
    let result = await ctx.service.material.create({
      type: 'office',
      name: 'book',
      quantity: 5,
      unit: 'set',
      price: 5,
    });
    assert(result && result._id);
    id.push(result._id.toString());
    result = await ctx.service.material.create({
      type: 'office',
      name: 'pen',
      quantity: 10,
      unit: 'pcs',
      price: 1,
    });
    assert(result && result._id);
    id.push(result._id.toString());
    result = await ctx.service.material.count();
    assert(result === 2);
  });

  it('should find normally', async () => {
    const ctx = app.mockContext();
    let result = await app.model.Matbook.create({
      user: '5a0518c2e71b8a0749cbafcc',
      name: 'test0',
      phone: '13600000000',
      price: 10,
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      cond: 0,
      materials: [{
        material: id[0],
        book: 1,
      }, {
        material: id[1],
        book: 5,
      }],
    });
    assert(result && result._id);
    result = await app.model.Matbook.create({
      user: '5a0518c2e71b8a0749cbafcc',
      name: 'test1',
      phone: '13611111111',
      price: 5,
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      cond: 1,
      materials: [{
        material: id[1],
        book: 5,
      }],
    });
    assert(result && result._id);
    // 状态为归还及预约将被忽略
    result = await app.model.Matbook.create({
      user: '5a0518c2e71b8a0749cbafcc',
      name: 'test1',
      phone: '13611111111',
      price: 5,
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      cond: 2,
      materials: [{
        material: id[1],
        book: 5,
      }],
    });
    assert(result && result._id);
    result = await app.model.Matbook.create({
      user: '5a0518c2e71b8a0749cbafcc',
      name: 'test1',
      phone: '13611111111',
      price: 5,
      takeDate: '2017-01-01',
      returnDate: '2017-01-03',
      cond: 3,
      materials: [{
        material: id[1],
        book: 5,
      }],
    });
    assert(result && result._id);
    result = await ctx.service.material.find({});
    assert(result.list.length === 2 && result.list[0].left === 4 && result.list[1].left === 0);
    result = await ctx.service.material.find({ limit: 1 });
    assert(result.list.length === 1 && result.list[0]._id.toString() === id[0]);
    result = await ctx.service.material.find({ skip: 1 });
    assert(result.list.length === 1 && result.list[0]._id.toString() === id[1]);
    result = await ctx.service.material.findById(id[0]);
    assert(result && result._id.toString() === id[0]);
  });

  it('should update normally', async () => {
    const ctx = app.mockContext();
    const result = await ctx.service.material.update({
      _id: id[0],
      price: 4,
    });
    assert(result && result.price === 4);
  });

  it('should remove normally', async () => {
    const ctx = app.mockContext();
    await ctx.service.material.removeById(id[0]);
    let result = await ctx.service.material.count();
    assert(result === 1);
    await app.model.Material.remove();
    result = await ctx.service.material.count();
    assert(result === 0);
    await app.model.Matbook.remove();
    result = await app.model.Matbook.count();
    assert(result === 0);
  });
});
