/* eslint valid-jsdoc: "off" */

'use strict';

const dotenv = require("dotenv")
dotenv.config()

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
          charset: 'utf8mb4'
        },
        host: '127.0.0.1',
        port: 3306,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWD,
    };
  
    return {
        ...config,
    };
  };
