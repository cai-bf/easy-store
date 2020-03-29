'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/user.test.js', () => {
  // 检查登录状态
  it('should GET /check_login', async () => {
    await app.httpRequest()
      .get('/check_login')
      .expect(401)
      .expect({
        errmsg: '请先登录',
        errcode: 401,
      });
  });
  // 登录
  it('should POST /auth', async () => {
    await app.httpRequest()
      .post('/auth')
      .send({ email: '906607626@qq.com', password: '1233' })
      .set('Accept', 'application/json')
      .expect(401)
      .expect({
        errmsg: '用户不存在或密码错误',
        errcode: 401,
      });

    const res = await app.httpRequest()
      .post('/auth')
      .send({ email: '906607626@qq.com', password: '123' })
      .set('Accept', 'application/json')
      .expect(200);
    assert(res.body.errcode === 0);
    assert(res.body.errmsg === '登陆成功');

    // 使用token验证登录状态
    return app.httpRequest()
      .get('/check_login')
      .set('Authorization', res.body.Authorization)
      .expect(200)
      .expect({
        errmsg: '已登录',
        errcode: 0,
      });
  });
  // 注册
  it('should POST /users', async () => {
    // 请求验证码
    // failure
    await app.httpRequest()
      .post('/users/verify')
      .send({ email: 'rgtdyb163.com' })
      .expect(400)
      .expect({
        errmsg: '请输入有效邮箱',
        errcode: 400,
      });
    // success
    await app.httpRequest()
      .post('/users/verify')
      .send({ email: 'rgtdyb@163.com' })
      .expect(200)
      .expect({
        errmsg: '发送验证码成功',
        errcode: 0,
      });

    // 调用注册接口
    // 验证码错误情况
    await app.httpRequest()
      .post('/users')
      .send({
        name: 'test',
        email: 'rgtdyb@163.com',
        password: '123',
        code: '222',
      })
      .expect(400, { errmsg: '验证码错误', errcode: 400 });
    // 参数错误情况
    await app.httpRequest()
      .post('/users')
      .send({
        name: 'test',
        email: 'rgtdyb163.com',
        password: '123',
        code: '222',
      })
      .expect(400, { errmsg: '参数错误, 请检查', errcode: 400 });
    // 正确情况
    const code = await app.redis.get('rgtdyb@163.com');
    await app.httpRequest()
      .post('/users')
      .send({
        name: 'test',
        email: 'rgtdyb@163.com',
        password: '123',
        code,
      })
      .expect(200, { errmsg: '注册成功', errcode: 0 });
    // 检测数据库
    const user = await app.model.User.findOne({ where: { email: 'rgtdyb@163.com' } });
    assert(user);
    // 邮箱已被注册情况
    await app.httpRequest()
      .post('/users')
      .send({
        name: 'test',
        email: 'rgtdyb@163.com',
        password: '123',
        code,
      })
      .expect(400, { errmsg: '该邮箱已被注册', errcode: 400 });
    // 删除该数据防止下次测试错误
    await app.model.User.destroy({ where: { id: user.id } });
  });
});
