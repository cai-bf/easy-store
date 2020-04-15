'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {
  // 获取列表
  async index(category_id, page, sort, keyword) {
    let params = {};
    params.limit = 20;
    params.offset = (parseInt(page) - 1) * 20;
    if (parseInt(category_id) !== 0) {
      const category = await this.app.model.Category.findByPk(category_id);
      if (category.parent_id === 0) {
        let tmp = [];
        for (const ca of await category.getChildren()) {
          tmp.push(ca.id);
        }
        params.where = { category_id: { [this.app.Sequelize.Op.in]: tmp } };
      } else {
        params.where = { category_id: parseInt(category_id) };
      }
    }
    parseInt(sort) === 1 ?
      params.order = this.app.Sequelize.literal('view DESC')
      : params.order = this.app.Sequelize.literal('sale_num DESC');
    if (keyword !== null)
      params.where = Object.assign(params.where || {}, { name: { [this.app.Sequelize.Op.substring]: keyword } });
    params.include = [{ model: this.app.model.Category, as: 'category' }];
    params.attributes = { exclude: ['description'] };
    const data = await this.ctx.model.Goods.findAndCountAll(params).then(res => {
      for (let item of res.rows) {
        item.pic = JSON.parse(item.pic);
      }
      return {
        items: res.rows,
        rows: res.rows.length,
        count: res.count
      };
    });
    return data;
  }

  // 详情
  async getDetail(goods_id) {
    const goods = await this.app.model.Goods.findOne({
      where: {
        id: goods_id
      },
      include: [
        {
          model: this.app.model.Specification,
          as: 'specifications',
          attributes: ['id', ['name', 'k'], ['name', 'k_s']],
          include: [
            {
              model: this.app.model.Option,
              as: 'options',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: this.app.model.Sku,
          as: 'sku',
          attributes: ['id', 'price', 'stock_num'],
          include: [
            {
              model: this.app.model.SkuSpec,
              as: 'sku_spec',
              include: [
                {
                  model: this.app.model.Specification,
                  as: 'specification'
                },
                {
                  model: this.app.model.Option,
                  as: 'option'
                }
              ]
            }
          ]
        }
      ]
    }).then(res => {
      if (res === null)
        return null;
      // 修改属性名
      res = res.toJSON();
      res.tree = res.specifications;
      delete res.specifications;
      for (const spec of res.tree) {
        spec.v = spec.options;
        delete spec.options;
      }
      res.list = res.sku;
      delete res.sku;
      // 判断是否有规格
      if (res.tree.length === 0) {
        delete res.tree;
        res.collection_id = res.list[0].id;
        delete res.list;
      } else {
        for (const sku of res.list) {
          for (const sku_s of sku.sku_spec) {
            sku[sku_s.specification.name] = sku_s.option.id;
          }
          delete sku.sku_spec;
        }
      }
      res.pic = JSON.parse(res.pic);
      return res;
    });
    return goods;
  }

  // 管理端商品列表
  async index_admin(category_id, page, sort, desc, overdue, keyword) {
    let params = {};
    // 分页处理
    params.limit = 20;
    params.offset = (parseInt(page) - 1) * 20;
    // 去除重复计算关联
    params.distinct = true;
    // 类别处理
    if (parseInt(category_id) !== 0) {
      const category = await this.app.model.Category.findByPk(category_id);
      if (category.parent_id === 0) {
        let tmp = [];
        for (const ca of await category.getChildren()) {
          tmp.push(ca.id);
        }
        params.where = { category_id: { [this.app.Sequelize.Op.in]: tmp } };
      } else {
        params.where = { category_id: parseInt(category_id) };
      }
    }
    // 排序处理
    let literal, _desc;
    if (parseInt(sort) === 0)
      literal = 'created_at';
    else if (parseInt(sort) === 1)
      literal = 'sale_num';
    else if (parseInt(sort) === 2)
      literal = 'view';
    else
      literal = 'stock_num';
    if (parseInt(desc) === 0)
      _desc = ' ASC';
    else
      _desc = ' DESC';
    params.order = this.app.Sequelize.literal(literal + _desc);
    // 处理下架商品
    if (parseInt(overdue) === 1) {
      params.paranoid = false;
      params.where = Object.assign(params.where || {}, { deleted_at: { [this.app.Sequelize.Op.not]: null } });
    }
    // 处理搜索词
    if (keyword !== null)
      params.where = Object.assign(params.where || {}, { name: { [this.app.Sequelize.Op.substring]: keyword } });
    // 关联
    params.include = [
      {
        model: this.app.model.Category,
        as: 'category',
        attributes: { exclude: ['created_at', 'updated_at'] }
      },
      {
        model: this.app.model.Sku,
        as: 'sku',
        paranoid: parseInt(overdue) === 1 ? false : true,
        attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
        include: [
          {
            model: this.app.model.Option,
            as: 'options',
            paranoid: parseInt(overdue) === 1 ? false : true,
            attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
            through: { attributes: [] }
          }
        ]
      },
      {
        model: this.app.model.Specification,
        as: 'specifications',
        paranoid: parseInt(overdue) === 1 ? false : true,
        attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
        include: [
          {
            model: this.app.model.Option,
            as: 'options',
            attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
          }
        ]
      }
    ];
    params.attributes = { exclude: ['description', 'deleted_at'] };
    const data = await this.ctx.model.Goods.findAndCountAll(params).then(res => {
      const rows = [];
      for (const item of res.rows) {
        rows.push(item.toJSON());
      }
      res = {
        rows: rows.length,
        items: rows,
        count: res.count
      };
      for (let item of res.items) {
        item.pic = JSON.parse(item.pic);
        if (item.specifications.length === 0) {
          item.has_spec = false;
          item.sku_id = item.sku[0].id;
        } else {
          item.has_spec = true;
        }
      }
      return res;
    });
    return data;
  }

  // 管理端商品详情
  async getDetailAdmin(goods_id) {
    const goods = await this.app.model.Goods.findOne({
      paranoid: false,
      where: {
        id: goods_id
      },
      attributes: { exclude: ['deleted_at'] },
      include: [
        {
          model: this.app.model.Category,
          as: 'category',
          attributes: ['id', 'name', 'parent_id', 'picture']
        },
        {
          model: this.app.model.Specification,
          as: 'specifications',
          attributes: ['id', 'name', 'goods_id'],
          include: [
            {
              model: this.app.model.Option,
              as: 'options',
              attributes: ['id', 'name', 'spec_id']
            }
          ]
        },
        {
          model: this.app.model.Sku,
          as: 'sku',
          attributes: ['id', 'price', 'stock_num', 'sale_num', 'purchase_price'],
          include: [
            {
              model: this.app.model.Option,
              as: 'options',
              attributes: ['id', 'name', 'spec_id'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    }).then(res => {
      if (res === null)
        return null;
      // toJSON
      res = res.toJSON();
      res.pic = JSON.parse(res.pic);
      // 判断是否有规格
      if (res.specifications.length === 0) {
        res.has_spec = false;
        res.sku_id = res.sku[0].id;
      } else {
        res.has_spec = true;
      }
      return res;
    });
    return goods;
  }

  // 新增商品
  async create() {
    const { ctx } = this;
    const data = ctx.request.body;
    // 创建goods
    const goods = await ctx.model.Goods.create({
      name: data.name,
      pic: JSON.stringify(data.pic),
      description: data.description,
      category_id: data.category_id,
      price: data.price
    });
    if (data.has_spec) {
      // 创建规格
      for (let i = 0; i < data.spec_num; i++) {
        data.spec[i] = await ctx.model.Specification.create({
          goods_id: goods.id,
          name: data.spec[i]
        });
      }
      // 创建规格选项
      for (let j = 0; j < data.spec_num; j++) {
        for (let i = 0; i < data.options[j].length; i++) {
          data.options[j][i] = await ctx.model.Option.create({
            spec_id: data.spec[j].id,
            name: data.options[j][i]
          });
        }
      }
      // 创建sku
      for (const sku of data.sku) {
        let new_sku = await ctx.model.Sku.create({
          goods_id: goods.id,
          price: sku.price,
          purchase_price: sku.purchase_price
        });
        // 关联sku, spec, option
        for (let i = 0; i < sku.spec.length; i++) {
          await ctx.model.SkuSpec.create({
            sku_id: new_sku.id,
            spec_id: data.spec[i].id,
            option_id: data.options[i][sku.spec[i]].id
          });
        }
        // 新增入库
        await ctx.service.goods.put_storage(new_sku.id, sku.stock_num);
      }
    } else {
      // 无规格商品
      const sku = await ctx.model.Sku.create({
        goods_id: goods.id,
        price: data.price,
        purchase_price: data.purchase_price
      });
      await ctx.service.goods.put_storage(sku.id, data.stock_num);
    }
  }

  // 新增入库
  async put_storage(sku_id, num) {
    const { ctx } = this;
    const sku = await ctx.model.Sku.findByPk(sku_id);
    if (sku === null)
      return false;
    await sku.increment({ stock_num: num });
    const goods = await sku.getGoods();
    await goods.increment({ stock_num: num });
    await ctx.model.Record.create({
      sku_id: sku_id,
      num: num,
      price: num * sku.purchase_price
    });
    return true;
  }
}

module.exports = GoodsService;
