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

  async create(data) {
    const t = await this.ctx.model.transaction();
    try {
      const order = await this.ctx.model.Order.create({
        user_id: this.ctx.current_user.id,
        order_number: Math.random().toString().substr(2),
        price: 0,
        address_id: data.address_id,
        status: 1,
        remark: data.remark || null
      }, { transaction: t });
      for (const item of data.goods) {
        await this.ctx.model.Goods.decrement('stock_num',
               { by: item.num, where: {id: item.goods_id}, transaction: t });
        let sku = await this.ctx.model.Sku.findByPk(item.sku_id);
        await sku.decrement('stock_num', { by: item.num, transaction: t });
        await order.increment('price', { by: item.num * sku.price, transaction: t });
        await this.ctx.model.Item.create({
          order_id: order.id,
          sku_id: sku.id,
          num: item.num,
          price: sku.price * item.num
        }, { transaction: t });
      }
      await t.commit();
      if (data.from_cart) {
        for (const item of item.goods) {
          await this.ctx.model.Cart.destroy({ where: { user_id: this.ctx.current_user.id, sku_id: item.sku_id } });
        }
      }
      return true;
    } catch (err) {
      console.log(err);
      await t.rollback();
      return false;
    }
  }

  async admin_index(page, status, key) {
    let params = {};
    params.limit = 20;
    params.offset = (page - 1) * 20;
    console.log(status);
    if (status !== 0)
      params.where = { status: status };
    if (key)
      params.where = Object.assign(params.where || {}, { order_number: key });
    params.order = this.app.Sequelize.literal('id DESC');

    params.attributes = { exclude: ['deleted_at'] };
    params.distinct = true;
    params.include = [
      {
        model: this.app.model.Address,
        as: 'address',
        attributes: { exclude: ['created_at', 'updated_at', 'default'] }
      },
      {
        model: this.app.model.User,
        as: 'user',
        attributes: ['id', 'name', 'avatar']
      },
      {
        model: this.app.model.Item,
        as: 'items',
        attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
        include: [
          {
            model: this.app.model.Sku,
            as: 'sku',
            attributes: ['id', 'price'],
            include: [
              {
                model: this.app.model.Goods,
                as: 'goods',
                attributes: ['id', 'name', 'pic']
              },
              {
                model: this.app.model.Option,
                as: 'options',
                attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
                through: { attributes: [] }
              }
            ]
          },
          {
            model: this.app.model.Comment,
            as: 'comment',
            attributes: ['id', 'content']
          }
        ]
      }
    ];

    const data = await this.app.model.Order.findAndCountAll(params).then(res => {
      return {
        items: res.rows,
        rows: res.rows.length,
        count: res.count,
        page: page
      };
    });

    return data;
  }

  async admin_refund(order) {
    for (const item of await order.getItems()) {
      let sku = await item.getSku();
      let goods = await sku.getGoods();
      await sku.increment('stock_num', { by: item.num });
      await goods.increment('stock_num', { by: item.num });
      await item.destroy();
    }
    await order.destroy();
  }
}

module.exports = OrderService;
