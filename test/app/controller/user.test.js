'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const levelNum = 5;
const token = [];
const id = [];

describe('test/app/controller/user.test.js', () => {
  it('should get no users', async () => {
    await app.model.User.remove();
    const result = await app.model.User.count();
    assert(result === 0);
    app.mockCsrf();
    await app.httpRequest()
      .get(`${app.config.prefix}/users`)
      .expect(200)
      .expect([]);
  });

  it('should post normally', async () => {
    let result;
    const ctx = app.mockContext();
    for (let i = 0; i < levelNum; i++) {
      result = await app.model.User.create({
        account: `test${i}`,
        password: ctx.helper.sha1(`test${i}`),
        level: i,
      });
      assert(typeof result === 'object' && result._id);
      id.push(result._id.toString());
    }
    const checkToken = res => {
      assert(typeof res.body.token === 'string' && res.body.token);
      token.push(res.body.token);
    };
    app.mockCsrf();
    for (let i = 0; i < levelNum; i++) {
      await app.httpRequest()
        .post(`${app.config.prefix}/tokens`)
        .send({ account: `test${i}`, password: `test${i}` })
        .expect(201)
        .expect(checkToken);
      switch (i) {
        case 0:
        case 1:
        case 2:
        case 3:
          await app.httpRequest()
            .post(`${app.config.prefix}/users`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({ account: `new${i}`, password: `new${i}` })
            .expect(403)
            .expect(app.config.ERROR.USER.NOPERM);
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .expect(200)
            // 共5个账号，但管理员不应被查到，故只有3个
            .expect(res => assert(res.body.length === 3));
          break;
        case 4:
          await app.httpRequest()
            .post(`${app.config.prefix}/users`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({ account: `new${i}`, password: `new${i}` })
            .expect(201)
            .expect(res =>
              assert(typeof res.body.id === 'string'
                && res.body.id
                && res.headers.location === `/api/users?id=${res.body.id}`)
            );
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .expect(200)
            // 共6个账号，但管理员不应被查到，故只有4个，且根据account升续排列，故第1个为new4
            .expect(res => assert(res.body.length === 4 && res.body[0].account === 'new4'));
          break;
        default:
          break;
      }
    }
  });

  it('should get normally', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .get(`${app.config.prefix}/users`)
      .query({ id: id[0], account: 'test1', skip: 2, limit: 2 })
      .expect(200)
      .expect(res => assert(res.body.account === 'test0'));
    await app.httpRequest()
      .get(`${app.config.prefix}/users`)
      .query({ account: 'test1', skip: 2, limit: 2 })
      .expect(200)
      .expect(res => assert(res.body.account === 'test1'));
    await app.httpRequest()
      .get(`${app.config.prefix}/users`)
      .query({ skip: 1, limit: 2 })
      .expect(200)
      // 共6个账号，但管理员不应被查到，跳过1个限制2个，故只有2个，且根据account升续排列，故第1个为new4
      .expect(res => assert(res.body.length === 2 && res.body[0].account === 'test0'));
  });

  it('should put normally', async () => {
    app.mockCsrf();
    for (let i = 0; i < levelNum; i++) {
      switch (i) {
        case 0:
        case 1:
        case 2:
          await app.httpRequest()
            .put(`${app.config.prefix}/users`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({
              id: id[i],
              password: `test${i}`,
              user: {
                _id: id[4],
                account: `update${i}`,
              },
            })
            .expect(204)
            .expect({});
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[4] })
            .expect(200)
            .expect(async res => {
              assert(res.body.account === 'test4');
            });
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[i] })
            .expect(200)
            .expect(res => assert(res.body.account === `update${i}`));
          break;
        case 3:
          await app.httpRequest()
            .put(`${app.config.prefix}/users`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({
              id: id[i],
              password: `test${i}`,
              user: {
                _id: id[4],
                account: 'update4',
              },
            })
            .expect(403)
            .expect(app.config.ERROR.USER.NOPERM);
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[4] })
            .expect(200)
            .expect(res => assert(res.body.account === 'test4'));
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[i] })
            .expect(200)
            .expect(res => assert(res.body.account === `test${i}`));
          break;
        case 4:
          await app.httpRequest()
            .put(`${app.config.prefix}/users`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({
              id: id[i],
              password: `test${i}`,
              user: {
                _id: id[0],
                account: 'global0',
              },
            })
            .expect(204)
            .expect({});
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[0] })
            .expect(200)
            .expect(res => assert(res.body.account === 'global0'));
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[i] })
            .expect(200)
            .expect(res => assert(res.body.account === `test${i}`));
          await app.httpRequest()
            .put(`${app.config.prefix}/users`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({
              id: id[i],
              password: `test${i}`,
              user: {
                _id: id[i],
                account: `update${i}`,
              },
            })
            .expect(204)
            .expect({});
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[i] })
            .expect(200)
            .expect(res => assert(res.body.account === `update${i}`));
          break;
        default:
          break;
      }
    }
  });

  it('should del normally', async () => {
    app.mockCsrf();
    for (let i = 0; i < levelNum; i++) {
      switch (i) {
        case 0:
        case 1:
        case 2:
        case 3:
          await app.httpRequest()
            .del(`${app.config.prefix}/users`)
            .set('Authorization', `Bearer ${token[i]}`)
            .query({ id: id[0] })
            .expect(403)
            .expect(app.config.ERROR.USER.NOPERM);
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[0] })
            .expect(200)
            .expect(res => assert(res.body.account === 'global0'));
          break;
        case 4:
          await app.httpRequest()
            .del(`${app.config.prefix}/users`)
            .set('Authorization', `Bearer ${token[i]}`)
            .query({ id: id[0] })
            .expect(204)
            .expect({});
          await app.httpRequest()
            .get(`${app.config.prefix}/users`)
            .query({ id: id[0] })
            .expect(200)
            .expect({});
          break;
        default:
          break;
      }
    }
    await app.httpRequest()
      .get(`${app.config.prefix}/users`)
      .expect(200)
      // 删掉1个，共5个账号，但管理员不应被查到，故只有3个，且根据account升续排列，故第1个为new4
      .expect(res => assert(res.body.length === 3 && res.body[0].account === 'new4'));
    await app.model.User.remove();
    const result = await app.model.User.count();
    assert(result === 0);
  });
});
