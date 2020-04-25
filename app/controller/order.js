'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class OrderController extends Controller {
  async index() {
    const status = this.ctx.request.query.status || 1;
    const data = await this.ctx.service.order.index(parseInt(status));

    this.ctx.body = util.makeRes('获取成功', 0, data);
    this.ctx.status = 200;
  }

  async create() {
    const rules = {
      address_id: 'int',
      remark: { type: 'string', required: false },
      goods: { type: 'array', itemType: 'object', rule: {
        goods_id: 'int',
        sku_id: 'int',
        num: 'int'
      } },
      from_cart: 'bool'
    };
    try {
      this.ctx.validate(rules);
    } catch (e) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('参数错误, 请检查重试', 400);
      return;
    }

    const address = await this.ctx.model.Address.findByPk(this.ctx.request.body.address_id);
    if (address === null || address.user_id !== this.ctx.current_user.id) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('地址错误', 400);
      return;
    }

    for (const item of this.ctx.request.body.goods) {
      let goods = await this.ctx.model.Goods.findByPk(item.goods_id);
      let sku;
      if (goods !== null)
        sku = await goods.getSku({ where: { id: item.sku_id } });
      if (goods === null || sku.length === 0) {
        this.ctx.status = 400;
        this.ctx.body = util.makeRes('商品已下架或不存在该商品', 400);
        return;
      }
      if (sku[0].stock_num < item.num) {
        this.ctx.status = 400;
        this.ctx.body = util.makeRes('库存不足', 400);
        return;
      }
    }
    const ok = await this.ctx.service.order.create(this.ctx.request.body);
    if (!ok) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('库存不足', 400);
      return;
    }
    this.ctx.status = 200;
    this.ctx.body = util.makeRes('购买成功', 0);
    return;
  }
}

module.exports = OrderController;
