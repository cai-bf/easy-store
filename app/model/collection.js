'use strict';

const moment = require('moment');

module.exports = app => {
  const { DATE, INTEGER } = app.Sequelize;

  const Collection = app.model.define('collection', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    goods_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'goods',
        key: 'id',
      },
    },
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updated_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
  }, {
      underscored: true,
      tableName: 'collections',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

  Collection.associate = () => {
    app.model.Collection.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
    app.model.Collection.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id' });
  };

  return Collection;
};
