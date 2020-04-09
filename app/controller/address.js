'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class AddressController extends Controller {
  async create() {
    const { ctx } = this;
    const roles = {
      province: { type: 'string', max: 30 },
      city: { type: 'string', max: 30 },
      county: { type: 'string', max: 30 },
      detail: { type: 'string', max: 60 },
      name: { type: 'string', max: 20 },
      phone: { type: 'string', max: 18 },
      code: { type: 'string', max: 10 },
      default: { type: 'boolean' },
    };
    ctx.status = 400;
    try { // 检查参数
      ctx.validate(roles);
    } catch (e) {
      ctx.body = util.makeRes('参数错误, 请检查', 400, {});
      return;
    }

    const user_id = ctx.current_user.id;
    const data = ctx.request.body;

    await ctx.service.address.create(user_id, data);
    ctx.body = util.makeRes('添加成功', 0, {});
    ctx.status = 200;
    return;
  }

  async modify() {
    const { ctx } = this;
    const roles = {
      province: { type: 'string', max: 30 },
      city: { type: 'string', max: 30 },
      county: { type: 'string', max: 30 },
      detail: { type: 'string', max: 60 },
      name: { type: 'string', max: 20 },
      phone: { type: 'string', max: 18 },
      code: { type: 'string', max: 10 },
      default: { type: 'boolean' },
    };
    ctx.status = 400;
    try { // 检查参数
      ctx.validate(roles);
    } catch (e) {
      ctx.body = util.makeRes('参数错误, 请检查', 400, {});
      return;
    }

    const id = ctx.params.id;
    const user_id = ctx.current_user.id;
    const data = ctx.request.body;

    await ctx.service.address.modify(id, user_id, data);
    ctx.body = util.makeRes('修改成功', 0, {});
    ctx.status = 200;
    return;
  }

  async destroy() {
    const { ctx } = this;
    const res = await ctx.service.address.destroy(ctx.params.id);
    if (res.ok) {
      ctx.body = util.makeRes('删除成功', 0, {});
      ctx.status = 200;
    } else {
      ctx.body = util.makeRes(res.msg, 400, {});
      ctx.status = 400;
    }
    return;
  }

  async index() {
    const { ctx } = this;
    const data = await ctx.model.Address.findAll({
      where: {
        user_id: ctx.current_user.id,
        order: [['id', 'desc']],
      },
    });
    ctx.body = util.makeRes('获取成功', 0, { data });
    ctx.status = 200;
    return;
  }
}

module.exports = AddressController;
