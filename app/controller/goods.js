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
    
  }
}

module.exports = GoodsController;
