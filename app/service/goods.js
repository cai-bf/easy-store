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
        console.log(res);
      } else {
        for (const sku of res.list) {
          for (const sku_s of sku.sku_spec) {
            sku[sku_s.specification.name] = sku_s.option.id;
          }
          delete sku.sku_spec;
        }
      }
      return res;
    });
    return goods;
  }
}

module.exports = GoodsService;
