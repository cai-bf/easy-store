'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/address.test.js', () => {
  let item = null;
  before(async () => {
    const res = await app.httpRequest()
      .post('/auth')
      .send({ email: 'rgtdyb@163.com', password: '1234' })
      .expect(200);
    await app.redis.set('user_token', res.body.Authorization);
  });

  // 添加地址
  it('should POST /addresses', async () => {
    // 添加地址 添加时设置该地址不是默认地址
    await app.httpRequest()
      .post('/addresses')
      .set('Authorization', await app.redis.get('user_token'))
      .send({
        province: '广东省',
        city: '广州市',
        county: '白云区',
        detail: '嘉禾鹤边西街东四巷13号',
        name: '大哥大',
        phone: '13071655351',
        code: '123456',
        default: false,
      })
      .expect(200)
      .expect({
        errmsg: '添加成功',
        errcode: 0,
      });

    // 获取刚刚添加的地址
    item = await app.model.Address.findOne();

    // 添加地址 添加时设置该地址是默认地址
    await app.httpRequest()
      .post('/addresses')
      .set('Authorization', await app.redis.get('user_token'))
      .send({
        province: '广东省',
        city: '广州市',
        county: '白云区',
        detail: '嘉禾鹤边西街东四巷15号',
        name: '大哥大1号',
        phone: '13071655352',
        code: '123456',
        default: true,
      })
      .expect(200)
      .expect({
        errmsg: '添加成功',
        errcode: 0,
      });
  });

  // 修改地址 修改时设置该地址是默认地址
  it('should PUT /address/:id', async () => {
    await app.httpRequest()
      .put('/address/' + item.id)
      .set('Authorization', await app.redis.get('user_token'))
      .send({
        province: '广东省',
        city: '广州市',
        county: '白云区',
        detail: '嘉禾鹤边西街东四巷13号',
        name: '大哥',
        phone: '13071655352',
        code: '123456',
        default: true,
      })
      .expect(200)
      .expect({
        errmsg: '修改成功',
        errcode: 0,
      });
  });

  // 获取地址
  it('should GET /addresses', async () => {
    const res = await app.httpRequest()
      .get('/addresses')
      .set('Authorization', await app.redis.get('user_token'))
      .expect(200);
    assert(res.body.data[0].province === '广东省');
    assert(res.body.data[0].city === '广州市');
    assert(res.body.data[0].county === '白云区');
    assert(res.body.data[0].detail === '嘉禾鹤边西街东四巷13号');
    assert(res.body.data[0].name === '大哥');
    assert(res.body.data[0].phone === '13071655352');
    assert(res.body.data[0].code === '123456');
    assert(res.body.data[0].default === true);
  });

  // 删除地址
  it('should DELETE /address/:id', async () => {
    // 删除成功
    await app.httpRequest()
      .delete('/address/' + item.id)
      .set('Authorization', await app.redis.get('user_token'))
      .expect(200)
      .expect({
        errmsg: '删除成功',
        errcode: 0,
      });

    // 删除失败，已经被删除
    await app.httpRequest()
      .delete('/address/' + item.id)
      .set('Authorization', await app.redis.get('user_token'))
      .expect(400);

    item = await app.model.Address.findOne();
    // 删除成功
    await app.httpRequest()
      .delete('/address/' + item.id)
      .set('Authorization', await app.redis.get('user_token'))
      .expect(200)
      .expect({
        errmsg: '删除成功',
        errcode: 0,
      });
  });

});
