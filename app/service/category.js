'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
  async createParent(data) {
    await this.ctx.model.Category.create({ ...data, parent_id: 0 });
    return;
  }

  async createChildren(parent_id, items) {
    for (const item of items) {
      item.parent_id = parent_id;
    }
    await this.ctx.model.Category.bulkCreate(items);
  }

  async modify(id, data) {
    let category = await this.ctx.model.Category.findByPk(id);
    category.update(data);
  }

  async destroy(id, change_id) {
    const from = await this.ctx.model.Category.findByPk(id);
    if (change_id === undefined) { // 直接删除
      if (from.parent_id == 0) {
        const categoryies = await from.getChildren();
        let ids = [];
        for (const c of categoryies) {
          ids.push(c.id);
        }
        const Op = this.app.Sequelize.Op;
        await this.ctx.model.Goods.destroy({ 
          where: {
            category_id: {
              [Op.in]: ids
            }
          }
        });
        await this.ctx.model.Category.destroy({
          where: {
            id: {
              [Op.in]: ids
            }
          }
        });
      }
      await this.ctx.model.Goods.destroy({ 
        where: {
          category_id: from.id
        }
      });
      await from.destroy();
    } else {
      const to = await this.ctx.model.Category.findByPk(change_id);
      if (from.parent_id === 0 || to.parent_id === 0) {
        return { ok: false, msg: '一级分类无法转移, 且二级分类只能转移至二级分类' };
      }
      await this.ctx.model.Goods.update({ category_id: to.id }, {
        where: {
          category_id: from.id
        }
      });
      await from.destroy();
    }
    return { ok: true };
  }
}

module.exports = CategoryService;
