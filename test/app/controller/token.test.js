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
      .post(`${app.config.prefix}/tokens`)
      .send({ account: 'test', password: 'test' })
      .expect(400)
      .expect(app.config.ERROR.USER.NOEXIST);
    const ctx = app.mockContext();
    const result = await app.model.User.create({
      account: 'test',
      password: ctx.helper.sha1('test'),
    });
    assert(typeof result === 'object' && result._id);
    await app.httpRequest()
      .post(`${app.config.prefix}/tokens`)
      .send({ account: 'test', password: 'test0' })
      .expect(400)
      .expect(app.config.ERROR.USER.WPASSWD);
  });

  it('should create a token', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .post(`${app.config.prefix}/tokens`)
      .send({ account: 'test', password: 'test' })
      .expect(201)
      .expect(res => assert(typeof res.body.token === 'string' && res.body.token));
    await app.model.User.remove();
    const result = await app.model.User.count();
    assert(result === 0);
  });
});
