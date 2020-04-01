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

  config.sequelize = {
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    host: '127.0.0.1',
    port: 3306,
    database: process.env.DB_NAME_TEST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
  };

  return {
    ...config,
  };
};
