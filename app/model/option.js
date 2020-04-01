'use strict';

const moment = require('moment');

module.exports = app => {
  const { DATE, INTEGER, STRING } = app.Sequelize;

  const Option = app.model.define('option', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    spec_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'specifications',
        key: 'id',
      },
    },
    name: {
      type: STRING(30),
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
    underscored: true,
    tableName: 'options',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Option.associate = () => {
    app.model.Option.belongsTo(app.model.Specification, { as: 'specification', foreignKey: 'spec_id' });
    app.model.Option.belongsToMany(app.model.Sku, { as: 'skus', through: app.model.SkuSpec });
    app.model.Option.hasMany(app.model.SkuSpec, { as: 'sku_specs', foreignKey: 'option_id' });
  };

  return Option;
};
