'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const levelNum = 5;
const token = [];
let id;

describe('test/app/controller/note.test.js', () => {
  it('should get no notes', async () => {
    await app.model.Note.remove();
    const result = await app.model.Note.count();
    assert(result === 0);
    app.mockCsrf();
    await app.httpRequest()
      .get(`${app.config.prefix}/notes`)
      .expect(200)
      .expect({ total: 0, list: [] });
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
    }
    const checkToken = res => {
      assert(typeof res.body.token === 'string' && res.body.token);
      token.push(res.body.token);
    };
    const checkId = res => {
      assert(typeof res.body.id === 'string' && res.body.id);
      id = res.body.id;
      assert(res.headers.location === `${app.config.prefix}/notes?id=${id}`);
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
            .post(`${app.config.prefix}/notes`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({ title: `test${i}`, content: `test${i}` })
            .expect(403)
            .expect(app.config.ERROR.USER.NOPERM);
          await app.httpRequest()
            .get(`${app.config.prefix}/notes`)
            .expect(200)
            .expect({ total: 0, list: [] });
          break;
        case 4:
          await app.httpRequest()
            .post(`${app.config.prefix}/notes`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({ title: `test${i}`, content: `test${i}` })
            .expect(201)
            .expect(checkId);
          await app.httpRequest()
            .get(`${app.config.prefix}/notes`)
            .expect(200)
            .expect(res => assert(res.body.list.length === 1));
          break;
        default:
          break;
      }
    }
    for (let i = 5; i < 9; i++) {
      await app.httpRequest()
        .post(`${app.config.prefix}/notes`)
        .set('Authorization', `Bearer ${token[4]}`)
        .send({ title: `test${i}`, content: `test${i}` })
        .expect(201)
        .expect(res =>
          assert(typeof res.body.id === 'string'
            && res.body.id
            && res.headers.location === `${app.config.prefix}/notes?id=${res.body.id}`)
        );
    }
    await app.httpRequest()
      .get(`${app.config.prefix}/notes`)
      .expect(200)
      .expect(res => assert(res.body.list.length === 5));
  });

  it('should get normally', async () => {
    app.mockCsrf();
    await app.httpRequest()
      .get(`${app.config.prefix}/notes`)
      .query({ id, title: 'test5', skip: 2, limit: 2 })
      .expect(200)
      .expect(res => assert(res.body.title === 'test4'));
    await app.httpRequest()
      .get(`${app.config.prefix}/notes`)
      .query({ title: 'test5', skip: 2, limit: 2 })
      .expect(200)
      .expect(res => assert(res.body.title === 'test5'));
    await app.httpRequest()
      .get(`${app.config.prefix}/notes`)
      .query({ skip: 2, limit: 2 })
      .expect(200)
      .expect(res => assert(res.body.list.length === 2 && res.body.list[0].title === 'test6'));
  });

  it('should put normally', async () => {
    app.mockCsrf();
    for (let i = 0; i < levelNum; i++) {
      switch (i) {
        case 0:
        case 1:
        case 2:
        case 3:
          await app.httpRequest()
            .put(`${app.config.prefix}/notes`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({ _id: id, title: 'update0' })
            .expect(403)
            .expect(app.config.ERROR.USER.NOPERM);
          await app.httpRequest()
            .get(`${app.config.prefix}/notes`)
            .query({ id })
            .expect(200)
            .expect(res => assert(res.body.title === 'test4' && res.body.content === 'test4'));
          break;
        case 4:
          await app.httpRequest()
            .put(`${app.config.prefix}/notes`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({ _id: id, title: 'update0' })
            .expect(204)
            .expect({});
          await app.httpRequest()
            .get(`${app.config.prefix}/notes`)
            .query({ id })
            .expect(200)
            .expect(res => assert(res.body.title === 'update0' && res.body.content === 'test4'));
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
            .del(`${app.config.prefix}/notes`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({ _id: id })
            .expect(403)
            .expect(app.config.ERROR.USER.NOPERM);
          await app.httpRequest()
            .get(`${app.config.prefix}/notes`)
            .query({ id })
            .expect(200)
            .expect(res => assert(res.body.title === 'update0' && res.body.content === 'test4'));
          break;
        case 4:
          await app.httpRequest()
            .del(`${app.config.prefix}/notes`)
            .set('Authorization', `Bearer ${token[i]}`)
            .send({ _id: id })
            .expect(204)
            .expect({});
          await app.httpRequest()
            .get(`${app.config.prefix}/notes`)
            .query({ id })
            .expect(200)
            .expect({});
          break;
        default:
          break;
      }
    }
    await app.httpRequest()
      .get(`${app.config.prefix}/notes`)
      .expect(200)
      .expect(res => assert(res.body.list.length === 4 && res.body.list[0].title === 'test8'));
    await app.model.User.remove();
    let result = await app.model.User.count();
    assert(result === 0);
    await app.model.Note.remove();
    result = await app.model.Note.count();
    assert(result === 0);
  });
});
