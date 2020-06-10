'use strict';
const Service = require('egg').Service;

class CartService extends Service {
  async index() {
    const user = this.ctx.current_user;
    const data = await user.getCarts({
      order: this.app.Sequelize.literal('id DESC'),
      include: [
        {
          model: this.ctx.model.Sku,
          as: 'sku',
          attributes: ['id', 'goods_id', 'price', 'stock_num'],
          include: [
            {
              model: this.ctx.model.Goods,
              paranoid: false,
              as: 'goods',
              attributes: ['id', 'name', 'pic', 'deleted_at']
            },
            {
              model: this.ctx.model.Option,
              as: 'options',
              attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
              through: { attributes: [] }
            }
          ]
        }
      ]
    }).then(res => {
      let data = [];
      for (const item of res) {
        data.push(item.toJSON());
      }
      for (const item of data) {
        item.sku.goods.pic = JSON.parse(item.sku.goods.pic);
      }
      return data;
    });
    return data;
  }

  async create(data) {
    const goods = await this.ctx.model.Goods.findByPk(data.goods_id);
    if (goods === null) {
      return {data: '商品不存在或已下架', ok: false};
    }
    const sku = await this.ctx.model.Sku.findByPk(data.sku_id);
    if (sku === null || sku.goods_id !== goods.id) {
      return { data: '参数错误', ok: false };
    }
    if (sku.stock_num < data.num) {
      return { data: '库存不足', ok: false };
    }

    // 判断是否已经存在
    const cart = await this.ctx.model.Cart.findOne({
      where: {
        user_id: this.ctx.current_user.id,
        sku_id: sku.id
      }
    });
    if (cart !== null) {
      const { ok } = await this.update(cart.id, data.num + cart.num);
      if (ok)
        return { data: '增加购物车成功', ok: true };
      return { data: '库存不足', ok: false };
    }

    await this.ctx.model.Cart.create({
      user_id: this.ctx.current_user.id,
      sku_id: data.sku_id,
      num: data.num
    });
    return { data: '加入购物车成功', ok: true };
  }

  async update(cart_id, num) {
    const cart = await this.ctx.model.Cart.findByPk(cart_id);
    if (cart === null || cart.user_id !== this.ctx.current_user.id) {
      return { data: '购物车没有该商品', ok: false };
    }

    const sku = await this.ctx.model.Sku.findByPk(cart.sku_id);
    if (sku.stock_num < num) {
      return { data: '库存不足', ok: false };
    }

    await cart.update({ num: num });

    return { data: '更新成功', ok: true };
  }

  async destroy(cart_ids) {
    for (const cart_id of cart_ids) {
      const cart = await this.ctx.model.Cart.findByPk(cart_id);
      if (cart === null || cart.user_id !== this.ctx.current_user.id)
        continue;
      await cart.destroy();
    }
  }
}

module.exports = CartService;
