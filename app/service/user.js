'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserService extends Service {
  async login(email, pswd) {
    const user = await this.ctx.model.User.findOne({
      where: {
        email,
      },
    });
    if (user == null || !bcrypt.compareSync(pswd, user.password)) {
      return {
        res: false,
        data: {},
      };
    }
    const token = jwt.sign({ id: user.id }, process.env.SALT, { expiresIn: '7d' });
    return {
      res: true,
      data: { Authorization: token },
    };
  }

  async register(data) {
    const user = await this.ctx.model.User.findOne({
      where: {
        email: data.email,
      },
    });
    if (user) {
      return {
        res: false,
        msg: '该邮箱已被注册',
      };
    }
    // 密码加密
    const salt = bcrypt.genSaltSync();
    data.password = bcrypt.hashSync(data.password, salt);

    await this.ctx.model.User.create(data);
    return {
      res: true,
      msg: '',
    };
  }
}

module.exports = UserService;
