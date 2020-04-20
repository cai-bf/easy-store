'use strict';

const Service = require('egg').Service;

class OrderService extends Service {
  async index(status) {
    const data = await this.app.model.Order.findAll({
      distinct: true,
      order: this.app.Sequelize.literal('id DESC'),
      where: {
        status: status
      },
      attributes: { exclude: ['deleted_at'] },
      include: [
        {
          model: this.app.model.Address,
          as: 'address',
          attributes: { exclude: ['created_at', 'updated_at'] }
        },
        {
          model: this.app.model.Item,
          as: 'items',
          attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
          include: [
            {
              model: this.app.model.Comment,
              as: 'comment'
            },
            {
              model: this.app.model.Sku,
              as: 'sku',
              attributes: ['id', 'goods_id'],
              include: [
                {
                  model: this.app.model.Goods,
                  as: 'goods',
                  attributes: ['id', 'name', 'pic']
                },
                {
                  model: this.app.model.Option,
                  as: 'options',
                  attributes: ['id', 'name'],
                  through: { attributes: [] }
                }
              ]
            }
          ]
        }
      ]
    }).then(res => {
      for (const order of res) {
        for (const item of order.items) {
          item.sku.goods.pic = JSON.parse(item.sku.goods.pic);
        }
      }
      return res;
    });
    return { data: data };
  }
}

module.exports = OrderService;
