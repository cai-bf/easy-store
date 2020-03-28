'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserService extends Service {
    async login(email, pswd) {
        let user = await this.ctx.model.User.findOne({
            where: {
                email: email
            }
        });
        if (user == null || !bcrypt.compareSync(pswd, user.password)) {
            return {
                res: false,
                data: {}
            };
        }
        let token = jwt.sign({ id: user.id }, process.env.SALT);
        return {
            res: true, 
            data: { Authorization: token }
        };
    }

    async register(data) {
        let user = await this.ctx.model.User.findOne({
            where: {
                email: data.email
            }
        });
        if (user) {
            return {
                res: false,
                msg: '该邮箱已被注册'
            }
        }
        // 密码加密
        const salt = bcrypt.genSaltSync();
        data.password = bcrypt.hashSync(data.password, salt);
        
        await this.ctx.model.User.create(data);
        return {
            res: true,
            msg: ''
        }
    }
}

module.exports = UserService;
