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
  router.get('/users', middleware.userAuth, controller.user.get_user_info); // 获取用户信息
  router.post('/users/password_verify', middleware.userAuth, controller.user.passord_verify); // 发送修改密码验证码
  router.put('/users/password', middleware.userAuth, controller.user.modify_password); // 修改密码
  router.put('/users', middleware.userAuth, controller.user.modify); // 修改用户信息

  // 用户的地址管理
  router.post('/addresses', middleware.userAuth, controller.address.create); // 用户添加地址收货人
  router.put('/address/:id', middleware.userAuth, controller.address.modify); // 用户修改地址收货人
  router.delete('/address/:id', middleware.userAuth, controller.address.destroy); // 用户删除某一项地址收货人
  router.get('/addresses', middleware.userAuth, controller.address.index); // 用户获取地址收货人列表

  //用户的收藏管理
  router.post('/collections', middleware.userAuth, controller.collection.create); // 用户添加收藏
  router.delete('/collections/:id', middleware.userAuth, controller.collection.destroy); // 用户删除收藏
  router.get('/collections', middleware.userAuth, controller.collection.index); // 用户获取收藏商品列表

  // admin验证
  router.post('/admin/auth', controller.admin.login); // 登录

  // 分类
  router.post('/admin/categories', middleware.adminAuth, controller.category.create); // 添加分类
  router.put('/admin/category/:id', middleware.adminAuth, controller.category.modify); // 修改分类
  router.delete('/admin/category/:id', middleware.adminAuth, controller.category.destroy); // 删除分类
  router.get('/categories', controller.category.index); // 获取分类

  // 上传
  router.post('/pictures', controller.attachment.upload); // 上传图片

  // 商品
  router.get('/goods', controller.goods.index); // 首页商品列表
  router.get('/goods/search', controller.goods.search); // 搜索商品
};
