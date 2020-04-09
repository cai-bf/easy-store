'use strict';
const Service = require('egg').Service;

class AddressService extends Service {
  async create(userid, data) {
    if (data.default === true) { //如果新地址是默认地址，把之前存在的默认地址设为false
      const address = await this.ctx.model.Address.findOne({
        where: {
          user_id: userid,
          default: true,
        },
      });
      if (address != null) { address.update({ default: false }); }
    }
    await this.ctx.model.Address.create({ ...data, user_id: userid });//添加新地址
    return;
  }
  async modify(id, userid, data) {
    if (data.default === true) {
      const address = await this.ctx.model.Address.findOne({
        where: {
          user_id: userid,
          default: true,
        },
      });
      if (address != null) { address.update({ default: false }); }
    }
    const address = await this.ctx.model.Address.findByPk(id);
    address.update(data);
  }
  async destroy(id) {
    const address = await this.ctx.model.Address.findByPk(id);
    if (address === null) {
      return { ok: false, msg: '该地址不存在，或许已经删除' };
    }
    await this.ctx.model.Address.destroy({
      where: {
        id:id,
      },
    });
    return { ok: true };
  }
}

module.exports = AddressService;
