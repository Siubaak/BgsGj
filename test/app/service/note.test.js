'use strict';

const { app, assert } = require('egg-mock/bootstrap');
let id;

describe('test/app/service/note.test.js', () => {
  it('should have no notes', async () => {
    const ctx = app.mockContext({ state: { user: { id: '5a014b4ef5ea8e590f0d31da' } } });
    await app.model.Note.remove();
    const result = await ctx.service.note.count();
    assert(result === 0);
  });

  it('should create normally', async () => {
    const ctx = app.mockContext({ state: { user: { id: '5a014b4ef5ea8e590f0d31da' } } });
    let result = await ctx.service.note.create({ title: 'test0', content: 'test0' });
    assert(typeof result === 'object' && result._id);
    result = await ctx.service.note.create({ title: 'test1', content: 'test1' });
    assert(typeof result === 'object' && result._id);
    id = result._id.toString();
    result = await ctx.service.note.count();
    assert(result === 2);
  });

  it('should find normally', async () => {
    const ctx = app.mockContext({ state: { user: { id: '5a014b4ef5ea8e590f0d31da' } } });
    let result = await ctx.service.note.find({});
    assert(result.length === 2);
    result = await ctx.service.note.find({ skip: 1 });
    assert(result.length === 1);
    result = await ctx.service.note.find({ limit: 1 });
    assert(result.length === 1);
    result = await ctx.service.note.find({ skip: 1, limit: 1 });
    assert(result.length === 1 && result[0]._id.toString() === id);
    result = await ctx.service.note.findById(id);
    assert(typeof result === 'object' && result.title === 'test1');
    result = await ctx.service.note.findByTitle('test1');
    assert(typeof result === 'object' && result._id.toString() === id);
  });

  it('should update normally', async () => {
    const ctx = app.mockContext({ state: { user: { id: '5a014b4ef5ea8e590f0d31da' } } });
    await ctx.service.note.update({
      _id: id,
      title: 'test2',
    });
    const result = await ctx.service.note.findById(id);
    assert(typeof result === 'object' && result.title === 'test2');
  });

  it('should remove normally', async () => {
    const ctx = app.mockContext({ state: { user: { id: '5a014b4ef5ea8e590f0d31da' } } });
    await ctx.service.note.removeById(id);
    let result = await ctx.service.note.count();
    assert(result === 1);
    await app.model.Note.remove();
    result = await ctx.service.note.count();
    assert(result === 0);
  });
});
