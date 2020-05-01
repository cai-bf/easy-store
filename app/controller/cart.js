'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class CartController extends Controller {
  // index
  async index() {
    const { ctx } = this;
    const data = await ctx.service.cart.index();
    ctx.status = 200;
    ctx.body = util.makeRes('获取成功', 0, { data: data });
  }
  // create
  async create() {
    const { ctx } = this;
    const rules = {
      goods_id: 'int',
      sku_id: 'int',
      num: 'int'
    };
    try {
      ctx.validate(rules);
    } catch (e) {
      ctx.status = 400;
      ctx.body = util.makeRes('参数错误, 请检查重试', 400, {});
      return;
    }
    const { data, ok } = await ctx.service.cart.create(ctx.request.body);
    ctx.status = ok ? 200 : 400;
    ctx.body = util.makeRes(data, ok ? 0 : 400);
  }
  // update
  async update() {
    const cart_id = this.ctx.params.id;
    const num = this.ctx.request.body.num;

    if (num <= 0) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('数量错误', 400);
      return;
    }
    
    const {data, ok} = await this.ctx.service.cart.update(cart_id, num);

    this.ctx.status = ok ? 200 : 400;
    this.ctx.body = util.makeRes(data, ok ? 0 : 400);
  }

  // delete
  async destroy() {
    const cart_ids = this.ctx.request.body.ids;
    
    await this.ctx.service.cart.destroy(cart_ids);

    this.ctx.status = 200;
    this.ctx.body = util.makeRes('删除成功', 0);

  }
}

module.exports = CartController;