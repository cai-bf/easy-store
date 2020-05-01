'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class CarouselController extends Controller {
  // index
  async index() {
    const data = [];
    const list_str = await this.app.redis.get('carousel_list');
    if (list_str) {
      const list = JSON.parse(list_str);
      for (const id of list) {
        let goods = await this.ctx.model.Goods.findOne({
          where: {
            id: id
          },
          attributes: ['id', 'name', 'pic']
        });
        goods = goods.toJSON();
        goods.pic = JSON.parse(goods.pic);
        data.push(goods);
      }
    }

    this.ctx.status = 200;
    this.ctx.body = util.makeRes('获取轮播图成功', 0, { data: data });
  }
  // upload carousel
  async upload() {
    const ids = this.ctx.request.body.goods_id;
    let success = true;
    for (const id of ids) {
      let goods = await this.ctx.model.Goods.findByPk(id);
      if (!goods) {
        success = false;
        break;
      }
    }
    if (success)
      await this.app.redis.set('carousel_list', JSON.stringify(ids));

    this.ctx.status = success ? 200 : 400;
    this.ctx.body = util.makeRes(success ? '设置轮播图成功' : '列表部分商品不存在或已下架',
                                  success ? 0 : 400);
  }

}

module.exports = CarouselController;