'use strict';

const Service = require('egg').Service;

class RecordService extends Service {
  async index(page) {
    const data = await this.ctx.model.Record.findAndCountAll({
      limit: 20,
      offset: (page - 1) * 20,
      distinct: true,
      order: this.app.Sequelize.literal('id DESC'),
      include: [
        {
          model: this.app.model.Sku,
          as: 'sku',
          attributes: ['id', 'price'],
          include: [
            {
              model: this.app.model.Goods,
              as: 'goods',
              paranoid: false,
              attributes: ['id', 'name']
            },
            {
              model: this.app.model.Option,
              as: 'options',
              attributes: ['id', 'name'],
              through: {
                attributes: []
              }
            }
          ]
        }
      ]
    }).then(res => {
      return {
        rows: res.rows.length,
        items: res.rows,
        count: res.count,
        page: page
      };
    });
    return data;
  }
}

module.exports = RecordService;
