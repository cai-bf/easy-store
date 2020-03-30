'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AdminService extends Service {
  async login(name, pswd) {
    const user = await this.ctx.model.Admin.findOne({
      where: {
        name,
      },
    });
    if (user == null || !bcrypt.compareSync(pswd, user.password)) {
      return {
        res: false,
        data: {},
      };
    }
    const token = jwt.sign({ id: user.id, admin: true }, process.env.SALT, { expiresIn: '1d' });
    return {
      res: true,
      data: { Authorization: token },
    };
  }
}

module.exports = AdminService;
