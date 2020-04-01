'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/category.test.js', () => {
  let c = null;
  before(async () => {
    const res = await app.httpRequest().post('/admin/auth')
      .send({
        name: 'admin',
        password: 'admin',
      })
      .expect(200);
    await app.redis.set('admin_token', res.body.Authorization);
  });
  // 创建一级分类
  it('should POST /admin/categories', async () => {
    await app.httpRequest()
      .post('/admin/categories')
      .set('Authorization', await app.redis.get('admin_token'))
      .send({
        parent_id: 0,
        items: [
          {
            name: 'test',
            picture: 'https://test.com/a.jpg',
          },
        ],
      })
      .expect(200)
      .expect({
        errmsg: '添加成功',
        errcode: 0,
      });
    // 获取该分类
    c = await app.model.Category.findOne();
  });

  // 创建二级分类
  it('should POST /admin/categories', async () => {
    await app.httpRequest()
      .post('/admin/categories')
      .set('Authorization', await app.redis.get('admin_token'))
      .send({
        parent_id: c.id,
        items: [
          {
            name: 'test_1',
            picture: 'https://test.com/b.jpg',
          },
          {
            name: 'test_2',
            picture: 'https://test.com/c.jpg',
          },
        ],
      })
      .expect(200)
      .expect({
        errmsg: '添加成功',
        errcode: 0,
      });
  });
  // 修改分类
  it('should put /admin/category:id', async () => {
    // 失败情况
    await app.httpRequest()
      .put('/admin/category/' + c.id)
      .set('Authorization', await app.redis.get('admin_token'))
      .send({
        picture: 'http//aaa.com',
      })
      .expect(400, {
        errmsg: '参数错误, 请检查',
        errcode: 400,
      });
    // 一级改为二级错误
    await app.httpRequest()
      .put('/admin/category/' + c.id)
      .set('Authorization', await app.redis.get('admin_token'))
      .send({
        parent_id: c.id + 1,
      })
      .expect(400, {
        errmsg: '一级分类无法修改为二级分类',
        errcode: 400,
      });
    // 成功
    await app.httpRequest()
      .put('/admin/category/' + c.id)
      .set('Authorization', await app.redis.get('admin_token'))
      .send({
        name: 'Test',
      })
      .expect(200, {
        errmsg: '修改成功',
        errcode: 0,
      });
  });
  // 获取分类
  it('should GET /categories', async () => {
    const res = await app.httpRequest()
      .get('/categories')
      .expect(200);
    assert(res.body.data[0].parent_id === 0);
    assert(res.body.data[0].name === 'Test');
    assert(res.body.data[0].picture === 'https://test.com/a.jpg');
    assert(res.body.data[0].children.length === 2);
    assert(res.body.data[0].children[0].name === 'test_1');
    assert(res.body.data[0].children[1].name === 'test_2');
  });
  // 删除分类
  it('should DELETE /admin/category/:id', async () => {
    // 删除一级分类并迁移商品error
    await app.httpRequest()
      .delete('/admin/category/' + c.id)
      .set('Authorization', await app.redis.get('admin_token'))
      .send({ change_id: c.id + 1 })
      .expect(400, {
        errmsg: '一级分类无法转移, 且二级分类只能转移至二级分类',
        errcode: 400,
      });
    // 删除二级分类并迁移商品
    await app.httpRequest()
      .delete('/admin/category/' + (c.id + 2))
      .set('Authorization', await app.redis.get('admin_token'))
      .send({ change_id: c.id + 1 })
      .expect(200, {
        errmsg: '删除成功',
        errcode: 0,
      });
    // 删除一级分类
    await app.httpRequest()
      .delete('/admin/category/' + c.id)
      .set('Authorization', await app.redis.get('admin_token'))
      .expect(200, {
        errmsg: '删除成功',
        errcode: 0,
      });
    // 测试当前表是否为空
    await app.httpRequest()
      .get('/categories')
      .expect(200, {
        errmsg: '获取成功',
        errcode: 0,
        data: [],
      });
  });

  after(async () => {
    await app.redis.del('admin_token');
  });
});
