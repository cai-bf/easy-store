'use strict';

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
    created_at: DATE,
    updated_at: DATE,
    deleted_at: DATE,
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'sku_spec',
  });

  SkuSpec.associate = () => {
    app.model.SkuSpec.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
    app.model.SkuSpec.belongsTo(app.model.Specification, { as: 'specification', foreignKey: 'spec_id' });
    app.model.SkuSpec.belongsTo(app.model.Option, { as: 'option', foreignKey: 'option_id' });
  };

  return SkuSpec;
};
