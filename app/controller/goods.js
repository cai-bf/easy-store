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

  // 管理端商品详情
  async detail_admin() {
    const { ctx } = this;
    const goods_id = parseInt(ctx.params.id);
    const data = await ctx.service.goods.getDetailAdmin(goods_id);
    if (data === null) {
      ctx.body = util.makeRes('不存在该商品或已下架', 400);
      ctx.status = 400;
      return;
    }
    ctx.body = util.makeRes('获取成功', 0, { data });
    ctx.status = 200;
  }

  // 增加商品
  async create() {
    const roles = {
      name: { type: 'string', max: 50 },
      pic: { type: 'array', itemType: 'url' },
      description: 'string',
      category_id: 'int',
      has_spec: 'bool',
      spec_num: { type: 'int', required: false },
      spec: { type: 'array', itemType: 'string', required: false },
      options: { type: 'array', itemType: 'array', required: false },
      sku: { type: 'array', required: false, itemType: 'object', rule: {
        spec: { type: 'array', itemType: 'int' },
        stock_num: 'int',
        price: 'number',
        purchase_price: 'number'
      } },
      price: 'number',
      stock_num: { type: 'int', required: false },
      purchase_price: { type: 'number', required: false }
    };
    try {
      this.ctx.validate(roles);
    } catch (e) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('参数错误, 请检查重试', 400, {});
      return;
    }
    // 检测分类
    const category = await this.app.model.Category.findByPk(this.ctx.request.body.category_id);
    if (category === null || category.parent_id === 0) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('分类错误, 请检查重试', 400, {});
      return;
    }
    // 检测规格选项
    if (this.ctx.request.body.has_spec && this.ctx.request.body.spec.length !== this.ctx.request.body.options.length) {
      this.ctx.status = 400;
      this.ctx.body = util.makeRes('规格选项错误, 请检查重试', 400, {});
      return;
    }
    // 创建商品
    await this.ctx.service.goods.create();

    this.ctx.body = util.makeRes('新增商品成功', 0);
    this.ctx.status = 200;
  }

  // 新增入库
  async increment() {
    const sku_id = parseInt(this.ctx.params.id);
    const num = this.ctx.request.body.num;

    const res = await this.ctx.service.goods.put_storage(sku_id, num);
    if (res) {
      this.ctx.body = util.makeRes('入库成功', 0);
      this.ctx.status = 200;
    } else {
      this.ctx.body = util.makeRes('参数错误, 请检查', 400);
      this.ctx.status = 400;
    }
  }

  // 更新商品
  async update() {
    const { ctx } = this;
    const roles = {
      name: { type: 'string', max: 50, required: false },
      pic: { type: 'array', itemType: 'url', required: false },
      description: { type: 'string', required: false },
      category_id: { type: 'int', required: false }
    }
    // 验证参数
    try {
      ctx.validate(roles);
    } catch (e) {
      ctx.status = 400;
      ctx.body = util.makeRes('参数错误, 请检查重试', 400, {});
      return;
    }
    // 判断商品
    const goods = await ctx.model.Goods.findByPk(parseInt(ctx.params.id));
    if (goods === null) {
      ctx.status = 400;
      ctx.body = util.makeRes('商品不存在或已下架', 400, {});
      return;
    }
    // 验证分类
    if (ctx.request.body.category_id) {
      const category = await ctx.model.Category.findByPk(parseInt(ctx.request.body.category_id));
      if (category === null || category.parent_id === 0) {
        ctx.status = 400;
        ctx.body = util.makeRes('类别出错, 请重新确认', 400, {});
        return;
      }
    }

    await ctx.service.goods.update(ctx.request.body, goods);

    ctx.body = util.makeRes('修改成功', 0);
    ctx.status = 200;
  }
}

module.exports = GoodsController;
