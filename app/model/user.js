'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    avatar: {
      type: STRING(200),
      allowNull: false,
      defaultValue: 'http://img3.imgtn.bdimg.com/it/u=1160348607,1578485562&fm=26&gp=0.jpg',
    },
    email: STRING(40),
    password: STRING(128),
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updated_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
  }, {
      underscored: true,
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

  User.associate = () => {
    app.model.User.hasMany(app.model.Address, { as: 'addresses', foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.Order, { as: 'orders', foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.Cart, { as: 'carts', foreignKey: 'user_id' });
  };

  return User;
};
