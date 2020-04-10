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
    
  }
}

module.exports = GoodsService;
