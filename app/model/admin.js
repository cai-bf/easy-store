'use strict';

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
    created_at: DATE,
    updated_at: DATE,
  }, {
    tableName: 'admin',
    underscored: true,
  });

  return Admin;
};
