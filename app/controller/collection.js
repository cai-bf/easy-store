'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class CollectionController extends Controller {
    async create() {
        const { ctx } = this;
        const roles = {
            goods_id: { type: 'integer' },
        }
        ctx.status = 400;
        try { // 检查参数
            ctx.validate(roles);
        } catch (e) {
            ctx.body = util.makeRes('参数错误, 请检查', 400, {});
            return;
        }

        const user_id = ctx.current_user.id;
        const data = ctx.request.body;

        const res = await ctx.service.collection.create(user_id, data);
        if (res.ok) {
            ctx.body = util.makeRes(res.msg, 0, {});
            ctx.status = 200;
        }
        else {
            ctx.body = util.makeRes(res.msg, 400, {});
            ctx.status = 400;
        }
        return;
    }

    async destroy() {
        const { ctx } = this;
        const res = await ctx.service.collection.destroy(ctx.params.id);
        if (res.ok) {
            ctx.body = util.makeRes('删除成功', 0, {});
            ctx.status = 200;
        } else {
            ctx.body = util.makeRes(res.msg, 400, {});
            ctx.status = 400;
        }
        return;
    }

    async index() {  //暂时写的是收藏全索引。或许可以考虑一下，收藏不用分页。按理来说一个人也不会收藏特别多
        const { ctx } = this;
        const user_id = ctx.current_user.id;
        // let query = this.ctx.query;
        // let page = query.page;
        const data = await ctx.service.collection.index(user_id);

        ctx.body = util.makeRes('获取成功', 0, { data });
        ctx.status = 200;
        return;
    }
}

module.exports = CollectionController;