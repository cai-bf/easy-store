'use strict';

const Service = require('egg').Service;

class CollectionService extends Service {
    async create(user_id, data) { //未完善
        let item = await this.ctx.model.Collection.findOne({
            where: {
                goods_id:data.goods_id,
                user_id: user_id
            },
          });
        if(item){
            return { ok: false, msg: '该商品已在收藏中' };
        }
        else{
            await this.ctx.model.Collection.create({ ...data, user_id: user_id });
            return { ok: true, msg: '添加收藏成功' };
        }
    }

    async destroy(id) {
        const collection = await this.ctx.model.Collection.findByPk(id);
        if (collection === null) {
            return { ok: false, msg: '该收藏记录不存在，或许已经删除' };
        }
        await this.ctx.model.Collection.destroy({
            where: {
                id: id,
            },
        });
        return { ok: true };
    }

    async index(user_id) {
        const data = await this.ctx.model.Collection.findAll({
            where: {
                user_id: user_id,
            },
            include: [
                {
                    model: this.ctx.model.Goods,
                    as: 'goods',
                    attributes: ['id', 'name', 'pic', 'price', 'category_id'],
                    include: [
                        {
                            model: this.ctx.model.Category,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ],
            order: [['id', 'desc']],
            attributes: ['id', 'goods_id']
        }).then(res => {
            //测试bug，找出是哪些商品的问题
            // for (const item of res) {
            //     item.goods.pic = JSON.parse(item.goods.pic);
            // }
            return res;
        });

        return data;
    }

}

module.exports = CollectionService;