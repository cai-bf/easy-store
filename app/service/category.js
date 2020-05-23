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
    const category = await this.ctx.model.Category.findByPk(id);
    category.update(data);
  }

  async destroy(id, change_id) {
    const from = await this.ctx.model.Category.findByPk(id);
    if (change_id === null) { // 直接删除
      if (from.parent_id === 0) { // 一级分类
        const categoryies = await from.getChildrens();
        // 判断二级分类是否有关联商品
        for (ca of categoryies) {
          const num = await this.ctx.model.Goods.count({
            where: {
              category_id: ca.id
            },
            paranoid: false
          });
          // 有关联商品返回失败
          if (num > 0) {
            return { ok: false, msg: '该分类下的二级分类 ' + ca.name + ' 尚有关联商品, 请先转移' };
          }
        }
        // 删除分类 
        const ids = [];
        for (const c of categoryies) {
          ids.push(c.id);
        }
        ids.push(from.id);
        await this.ctx.model.Category.destroy({
          where: {
            id: {
              [Op.in]: ids,
            },
          },
        });
        return { ok: true };
      } else { // 二级分类
        const num = await this.ctx.model.Goods.count({
          where: {
            category_id: from.id
          },
          paranoid: false
        });
        if (num > 0) {
          return { ok: false, msg: '尚有关联商品, 请选择转移分类' }
        }
        await from.destroy();
        return { ok: true};
      }
      
    } else {
      const to = await this.ctx.model.Category.findByPk(change_id);
      if (from.parent_id === 0 || to.parent_id === 0) {
        return { ok: false, msg: '一级分类无法转移, 且二级分类只能转移至二级分类' };
      }
      await this.ctx.model.Goods.update({ category_id: to.id }, {
        where: {
          category_id: from.id,
        },
        paranoid: false
      });
      await from.destroy();
    }
    return { ok: true };
  }
}

module.exports = CategoryService;
