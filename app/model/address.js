'use strict';

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
    created_at: DATE,
    updated_at: DATE,
  }, {
    underscored: true,
    tableName: 'address',
  });

  Address.associate = () => {
    app.model.Address.belongsTo(app.model.User);
  };

  return Address;
};
