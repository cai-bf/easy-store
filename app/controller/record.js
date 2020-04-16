'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class RecordController extends Controller {
  async index() {
    const page = this.ctx.request.query.page || 1;
    const data = await this.ctx.service.record.index(parseInt(page));

    this.ctx.body = util.makeRes('获取成功', 0, data);
    this.ctx.status = 200;
  }
}

module.exports = RecordController;
