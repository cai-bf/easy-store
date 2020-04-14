'use strict';

const moment = require('moment');

module.exports = app => {
  const { DATE, INTEGER, STRING } = app.Sequelize;

  const Specification = app.model.define('specification', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    goods_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'goods',
        key: 'id',
      },
    },
    name: {
      type: STRING(20),
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
    deleted_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('deleted_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'specifications',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Specification.associate = () => {
    app.model.Specification.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id' });
    app.model.Specification.hasMany(app.model.Option, { as: 'options', foreignKey: 'spec_id' });
    app.model.Specification.hasMany(app.model.SkuSpec, { as: 'sku_specs', foreignKey: 'spec_id' });
  };

  return Specification;
};
