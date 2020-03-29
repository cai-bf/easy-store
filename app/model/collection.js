'use strict';

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
    created_at: DATE,
    updated_at: DATE,
  }, {
    underscored: true,
    tableName: 'collections',
  });

  Collection.associate = () => {
    app.model.Collection.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
    app.model.Collection.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id' });
  };

  return Collection;
};
