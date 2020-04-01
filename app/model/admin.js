'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Admin = app.model.define('admin', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: STRING(30),
      allowNull: false,
    },
    password: {
      type: STRING(128),
      allowNull: false,
    },
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updated_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    tableName: 'admin',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Admin;
};
