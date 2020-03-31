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

  // 分类
  router.post('/admin/categories', middleware.adminAuth, controller.category.create); // 添加分类
  router.put('/admin/category/:id', middleware.adminAuth, controller.category.modify); // 修改分类
  router.delete('/admin/category/:id', middleware.adminAuth, controller.category.destroy); // 删除分类
  router.get('/categories', controller.category.index); // 获取分类
};
