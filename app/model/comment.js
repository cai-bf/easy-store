'use strict';

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const Comment = app.model.define('comment', {
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
    item_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
    },
    content: {
      type: STRING(400),
      allowNull: false,
    },
    created_at: DATE,
    updated_at: DATE,
  }, {
    underscored: true,
    tableName: 'comments',
  });

  Comment.associate = () => {
    app.model.Comment.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
    app.model.Comment.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id' });
    app.model.Comment.belongsTo(app.model.Item, { as: 'item', foreignKey: 'item_id' });
  };

  return Comment;
};
