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
      },
      {
        model: this.app.model.Sku,
        as: 'sku',
        paranoid: parseInt(overdue) === 1 ? false : true,
        include: [
          {
            model: this.app.model.Option,
            as: 'options',
            paranoid: parseInt(overdue) === 1 ? false : true,
            through: { attributes: [] }
          }
        ]
      },
      {
        model: this.app.model.Specification,
        as: 'specifications',
        paranoid: parseInt(overdue) === 1 ? false : true,
        include: [
          {
            model: this.app.model.Option,
            as: 'options'
          }
        ]
      }
    ];
    params.attributes = { exclude: ['description'] };
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
}

module.exports = GoodsService;
