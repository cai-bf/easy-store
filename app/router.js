'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  // 用户
  router.post('/auth', controller.user.login); // 登录
  router.post('/users/verify', controller.user.verify); // 验证码
  router.post('/users', controller.user.register); // 注册
  router.get('/check_login', middleware.userAuth, controller.user.check_login); // 检查登录

  // admin验证
  router.post('/admin/auth', controller.admin.login); // 登录
};
