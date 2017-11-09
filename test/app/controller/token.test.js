'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/token.test.js', () => {
  it('should have no users', async () => {
    await app.model.User.remove();
    const result = await app.model.User.count();
    assert(result === 0);
  });

  it('should get auth:user_not_found', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .post('/api/tokens')
      .send({ account: 'test', password: 'test' })
      .expect(403)
      .expect({
        code: 'auth:user_not_found',
        msg: '用户名或密码错误',
      });
    const ctx = app.mockContext();
    const result = await app.model.User.create({
      account: 'test',
      password: ctx.helper.sha1('test'),
    });
    assert(typeof result === 'object' && result._id);
    await app.httpRequest()
      .post('/api/tokens')
      .send({ account: 'test', password: 'test0' })
      .expect(403)
      .expect({
        code: 'auth:user_not_found',
        msg: '用户名或密码错误',
      });
  });

  it('should create a token', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .post('/api/tokens')
      .send({ account: 'test', password: 'test' })
      .expect(201)
      .expect(res => assert(typeof res.body.token === 'string' && res.body.token));
    await app.model.User.remove();
    const result = await app.model.User.count();
    assert(result === 0);
  });
});
