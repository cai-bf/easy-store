/* eslint valid-jsdoc: "off" */

'use strict';

const dotenv = require('dotenv');
dotenv.config();

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + process.env.KEY;

  // add your middleware config here
  config.middleware = [];

  config.sequelize = {
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    host: '127.0.0.1',
    port: 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
  };

  config.security = {
    csrf: false,
  };

  config.email = {
    client: {
      host: 'smtp.163.com',
      secureConnection: true,
      port: 465,
      auth: {
        user: 'rgtdyb',
        pass: process.env.EMAIL_PASS,
      },
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: null,
      db: 0,
    },
  };

  config.validate = {
    // convert: false,
    // validateRoot: false,
  };

  config.multipart = {
    fileSize: '8mb',
    whitelist: [
      '.png',
      '.jpg',
      '.jpeg'
    ],
  };

  return {
    ...config,
  };
};
