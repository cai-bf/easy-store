'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class GoodsController extends Controller {
  // 列表
  async index() {
    const { ctx } = this;
    const category_id = ctx.request.query.category_id || 0;
    const page = ctx.request.query.page || 1;
    const sort = ctx.request.query.sort || 1; // 1: 按浏览量, 2: 按销量
    const data = await ctx.service.goods.index(category_id, page, sort, null);
    ctx.body = util.makeRes('获取列表成功', 0, { data });
    ctx.status = 200;
  }
  // 搜索
  async search() {
    const { ctx } = this;
    const category_id = ctx.request.query.category_id || 0;
    const page = ctx.request.query.page || 1;
    const sort = ctx.request.query.sort || 1; // 1: 按浏览量, 2: 按销量
    const key = ctx.request.query.key || null;
    const data = await ctx.service.goods.index(category_id, page, sort, key);
    ctx.body = util.makeRes('获取列表成功', 0, { data });
    ctx.status = 200;
  }
  // 商品详情
  async getDetail() {
    const { ctx } = this;
    const goods_id = parseInt(ctx.params.id);
    const data = await ctx.service.goods.getDetail(goods_id);
    if (data === null) {
      ctx.body = util.makeRes('不存在该商品或已下架', 400);
      ctx.status = 400;
      return;
    }
    ctx.body = util.makeRes('获取成功', 0, { data });
    ctx.status = 200;
  }

  // 管理端商品列表
  async index_admin() {
    const { ctx } = this;
    const category_id = ctx.request.query.category_id || 0;
    const page = ctx.request.query.page || 1;
    const sort = ctx.request.query.sort || 0; //0: 按创建时间, 1: 按浏览量, 2: 按销量, 3: 按库存
    const overdue = ctx.request.query.overdue || 0; // 0: 展示未下架, 1: 展示已下架
    const desc = ctx.request.query.desc || 1; // 0: 正序, 1: 倒序

    const data = await ctx.service.goods.index_admin(category_id, page, sort, desc, overdue, null);
    ctx.body = util.makeRes('获取列表成功', 0, { data });
    ctx.status = 200;
  }

  // 管理端搜索
  async search_admin() {
    const { ctx } = this;
    const category_id = ctx.request.query.category_id || 0;
    const page = ctx.request.query.page || 1;
    const sort = ctx.request.query.sort || 0; //0: 按创建时间, 1: 按浏览量, 2: 按销量, 3: 按库存
    const key = ctx.request.query.key || null;
    const overdue = ctx.request.query.overdue || 0; // 0: 展示未下架, 1: 展示已下架
    const desc = ctx.request.query.desc || 1; // 0: 正序, 1: 倒序

    const data = await ctx.service.goods.index_admin(category_id, page, sort, desc, overdue, key);
    ctx.body = util.makeRes('获取列表成功', 0, { data });
    ctx.status = 200;
  }
}

module.exports = GoodsController;
