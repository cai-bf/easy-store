'use strict';

const Service = require('egg').Service;

class CollectionService extends Service {
    async create(user_id, data) {
        await this.ctx.model.Collection.create({ ...data, user_id: user_id });
        return;
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
            include: {
                model: this.ctx.model.Goods,
                as: 'goods',
            },
            order: [['id', 'desc']],
        });

        return data;
    }

}

module.exports = CollectionService;