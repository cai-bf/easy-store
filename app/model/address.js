'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const Address = app.model.define('address', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    province: {
      type: STRING(30),
      allowNull: false,
    },
    city: {
      type: STRING(30),
      allowNull: false,
    },
    county: {
      type: STRING(30),
      allowNull: false,
    },
    detail: {
      type: STRING(60),
      allowNull: false,
    },
    code: {
      type: STRING(10),
      allowNull: false,
    },
    name: {
      type: STRING(20),
      allowNull: false,
    },
    phone: {
      type: STRING(18),
      allowNull: false,
    },
    default: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updated_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    underscored: true,
    tableName: 'address',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  Address.associate = () => {
    app.model.Address.belongsTo(app.model.User);
  };

  return Address;
};
