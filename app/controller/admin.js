'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class AdminController extends Controller {
  async login() {
    const name = this.ctx.request.body.name;
    const password = this.ctx.request.body.password;
    const { res, data } = await this.ctx.service.admin.login(name, password);
    if (res) {
      this.ctx.status = 200;
      this.ctx.body = util.makeRes('登陆成功', 0, data);
    } else {
      this.ctx.status = 401;
      this.ctx.body = util.makeRes('用户不存在或密码错误', 401, {});
    }
  }
}

module.exports = AdminController;
