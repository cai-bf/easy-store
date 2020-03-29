'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class UserController extends Controller {
  // 检查登录
  async check_login() {
    this.ctx.status = 200;
    this.ctx.body = util.makeRes('已登录', 0, {});
  }

  // 登录
  async login() {
    const email = this.ctx.request.body.email;
    const password = this.ctx.request.body.password;
    const { res, data } = await this.ctx.service.user.login(email, password);
    if (res) {
      this.ctx.status = 200;
      this.ctx.body = util.makeRes('登陆成功', 0, data);
    } else {
      this.ctx.status = 401;
      this.ctx.body = util.makeRes('用户不存在或密码错误', 401, {});
    }
  }

  // 发送验证码
  async verify() {
    const { ctx, app } = this;
    const roles = {
      email: { type: 'email' },
    };
    try {
      ctx.validate(roles);
    } catch (e) {
      ctx.status = 400;
      ctx.body = util.makeRes('请输入有效邮箱', 400, {});
      return;
    }

    const email = ctx.request.body.email;

    const code = util.randomNum();
    await app.redis.set(email, code, 'EX', 60 * 5);

    const mailOptions = {
      from: 'rgtdyb@163.com',
      to: email,
      subject: '【天东易宝】注册验证',
      html: '您的验证码为 ' + code + ' 有效期为5分钟',
    };
    // 发送邮件
    await app.email.sendMail(mailOptions);

    ctx.status = 200;
    ctx.body = util.makeRes('发送验证码成功', 0, {});
  }

  // 注册
  async register() {
    const { ctx, app } = this;
    const roles = {
      name: { type: 'string', max: 30 },
      email: { type: 'email' },
      avatar: { type: 'string', required: false },
      password: { type: 'string' },
      code: { type: 'string' },
    };

    ctx.status = 400;

    try {
      ctx.validate(roles);
    } catch (e) {
      ctx.body = util.makeRes('参数错误, 请检查', 400, {});
      return;
    }

    // 检查验证码
    const code = await app.redis.get(ctx.request.body.email);
    if (code != ctx.request.body.code) {
      ctx.body = util.makeRes('验证码错误', 400, {});
      return;
    }

    const { res, msg } = await ctx.service.user.register(ctx.request.body);
    if (res) {
      ctx.status = 200;
      ctx.body = util.makeRes('注册成功', 0, {});
      return;
    }
    ctx.body = util.makeRes(msg, 400, {});
  }
}

module.exports = UserController;
