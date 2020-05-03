'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const SkuSpec = app.model.define('sku_spec', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    sku_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'skus',
        key: 'id',
      },
    },
    spec_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'specifications',
        key: 'id',
      },
    },
    option_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'options',
        key: 'id',
      },
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
    deleted_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('deleted_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'sku_spec',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  SkuSpec.associate = () => {
    app.model.SkuSpec.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
    app.model.SkuSpec.belongsTo(app.model.Specification, { as: 'specification', foreignKey: 'spec_id' });
    app.model.SkuSpec.belongsTo(app.model.Option, { as: 'option', foreignKey: 'option_id' });
  };

  return SkuSpec;
};
