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

  async refund() {
    const order_id = this.ctx.params.id;
    const reason = this.ctx.request.body.reason || '';
    const order = await this.ctx.model.Order.findByPk(parseInt(order_id));
    if (order === null || order.user_id !== this.ctx.current_user.id) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('不存在该订单', 400);
      return;
    }
    if (parseInt(order.status) !== 1) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('只有未发货商品可以退款', 400);
      return;
    }

    await order.update({ status: 4 });

    this.ctx.status = 200;
    this.ctx.body = util.makeRes('已申请退款中', 0);
  }

  async recv() {
    const order_id = this.ctx.params.id;
    const order = await this.ctx.model.Order.findByPk(parseInt(order_id));
    if (order === null || order.user_id !== this.ctx.current_user.id) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('不存在该订单', 400);
      return;
    }
    if (parseInt(order.status) !== 2) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('该订单不处于已发货状态, 无法确认收货', 400);
      return;
    }

    await order.update({ status: 3, refund_remark: reason });

    this.ctx.status = 200;
    this.ctx.body = util.makeRes('确认收货成功', 0);
  }

  async comment() {
    const item_id = this.ctx.params.id;
    const item = await this.ctx.model.Item.findOne({
      where: { id: parseInt(item_id) },
      include: [
        {
          model: this.ctx.model.Sku,
          as: 'sku'
        },
        {
          model: this.ctx.model.Order,
          as: 'order'
        }
      ]
    });
    if (item === null || item.order.user_id !== this.ctx.current_user.id) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('没有权限', 400);
      return;
    }
    if (item.order.status != 3) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('已签收才能评价', 400);
      return;
    }

    await this.ctx.model.Comment.create({
      user_id: this.ctx.current_user.id,
      goods_id: item.sku.goods_id,
      item_id: item.id,
      content: this.ctx.request.body.content
    });

    this.ctx.status = 200;
    this.ctx.body = util.makeRes('评价成功', 0);
    return;
  }

  async admin_index() {
    const { ctx } = this;
    const page = ctx.request.query.page ? parseInt(ctx.request.query.page) : 1;
    const status = ctx.request.query.type || 0;

    const data = await ctx.service.order.admin_index(page, status, null);

    ctx.status = 200;
    ctx.body = util.makeRes('获取成功', 0, { data: data });
  }

  async admin_search() {
    const { ctx } = this;
    const page = ctx.request.query.page ? parseInt(ctx.request.query.page) : 1;
    const status = ctx.request.query.type || 0;
    const key = ctx.request.query.key;
    if (!key) {
      ctx.status = 400;
      ctx.body = util.makeRes('请输入订单号', 400);
      return;
    }

    const data = await ctx.service.order.admin_index(page, status, key);

    ctx.status = 200;
    ctx.body = util.makeRes('获取成功', 0, { data: data });
  }

  async admin_deliver() {
    const rules = {
      number: 'string'
    };
    try {
      this.ctx.validate(rules);
    } catch (e) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('参数错误, 请检查重试', 400);
      return;
    }

    const order_id = this.ctx.params.id;
    const order = await this.ctx.model.Order.findByPk(order_id);

    if (order === null) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('不存在该订单', 400);
      return;
    }

    if (order.status != 1) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('不处于未发货状态', 400);
      return;
    }

    await order.update({
      status: 2,
      number: this.ctx.request.body.number
    });

    this.ctx.status = 200;
    this.ctx.body = util.makeRes('更新成功', 0);
  }

  async admin_refund() {
    const order_id = this.ctx.params.id;
    const order = await this.ctx.model.Order.findByPk(order_id);

    if (order === null) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('不存在该订单', 400);
      return;
    }

    if (order.status != 4) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('不处于退款中状态', 400);
      return;
    }

    await this.ctx.service.order.admin_refund(order);

    this.ctx.status = 200;
    this.ctx.body = util.makeRes('退款成功', 0);
  }
}

module.exports = OrderController;
