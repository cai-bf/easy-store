'use strict';

const jwt = require('jsonwebtoken');
const util = require('../util');

async function admin_auth(ctx, next) {

  const token = ctx.get('Authorization');
  let data;
  try {
    data = jwt.verify(token, process.env.SALT);
  } catch (e) {
    ctx.status = 401;
    ctx.body = util.makeRes('请先登录', 401, {});
    return;
  }
  if (!data.admin) {
    ctx.status = 401;
    ctx.body = util.makeRes('请先登录', 401, {});
    return;
  }
  ctx.current_admin = ctx.model.Admin.findByPk(data.id);

  await next();
}

module.exports = admin_auth;
