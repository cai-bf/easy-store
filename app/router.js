'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller, middleware } = app;
    // 用户
    router.post('/auth', controller.user.login);
    router.post('/users/verify', controller.user.verify);
    router.post('/users', controller.user.register);
};
