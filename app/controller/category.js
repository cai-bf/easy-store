'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class CategoryController extends Controller {
  async create() {
    const { ctx } = this;

    const parent_id = ctx.request.body.parent_id;
    const items = ctx.request.body.items;

    if (parent_id == 0) { // 一级类别 
      await ctx.service.category.createParent(items[0]);
    } else { // 二级类别
      await ctx.service.category.createChildren(parent_id, items);
    }

    ctx.body = util.makeRes('添加成功', 0, {});
    ctx.status = 200;
  }

  async modify() {
    const { ctx } = this;

    const roles = {
      name: { type: 'string', max: 30, required: false },
      parent_id: { type: 'int', min: 0, required: false },
      picture: { type: 'url', required: false }
    }
    try {
      ctx.validate(roles);
    } catch (e) {
      ctx.status = 400;
      ctx.body = util.makeRes('参数错误, 请检查', 400, {});
      return;
    }

    const data = ctx.request.body;
    const category = await ctx.model.Category.findByPk(ctx.params.id);
    // 判断是否合规
    if (data.parent_id != 0 && category.parent_id === 0) {
      ctx.status = 400;
      ctx.body = util.makeRes('一级分类无法修改为二级分类', 400, {});
      return;
    }

    await ctx.service.category.modify(ctx.params.id, data);

    ctx.status = 200;
    ctx.body = util.makeRes('修改成功', 0, {});
  }

  async destroy() {
    const { ctx } = this;
    const res = await ctx.service.category.destroy(ctx.params.id, ctx.request.body.change_id);
    if (res.ok) {
      ctx.body = util.makeRes('删除成功', 0, {});
      ctx.status = 200;
    } else {
      ctx.body = util.makeRes(res.msg, 400, {});
      ctx.status = 400;
    }
  }

  async index() {
    const { ctx } = this;
    const data = await ctx.model.Category.findAll({
      where: {
        parent_id: 0
      },
      include: [{
        model: ctx.model.Category,
        as: 'children'
      }]
    });
    ctx.body = util.makeRes('获取成功', 0, { data: data });
    ctx.status = 200;
  }
}

module.exports = CategoryController;
