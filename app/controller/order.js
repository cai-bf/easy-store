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
}

module.exports = OrderController;
