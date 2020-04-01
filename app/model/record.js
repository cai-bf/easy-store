'use strict';

const moment = require('moment');

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
    tableName: 'records',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Record.associate = () => {
    app.model.Record.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
  };

  return Record;
};
