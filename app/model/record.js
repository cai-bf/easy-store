'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  // 入库记录
  const Record = app.model.define('record', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    sku_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'skus',
        key: 'id',
      },
    },
    num: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '入库数量',
    },
    price: {
      type: INTEGER,
      allowNull: false,
      comment: '入库金额',
    },
    created_at: DATE,
    updated_at: DATE,
  }, {
    tableName: 'records',
    underscored: true,
  });

  Record.associate = () => {
    app.model.Record.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
  };

  return Record;
};
