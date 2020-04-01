'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Category = app.model.define('category', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: STRING(30),
      allowNull: false,
    },
    parent_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '上级分类， 0表示没有上级',
    },
    picture: {
      type: STRING,
      comment: '二级分类图片',
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
    tableName: 'categories',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Category.associate = () => {
    app.model.Category.hasMany(app.model.Category, { as: 'children', foreignKey: 'parent_id' });
    app.model.Category.belongsTo(app.model.Category, { as: 'parent', foreignKey: 'parent_id' });
    app.model.Category.hasMany(app.model.Goods, { as: 'goods', foreignKey: 'category_id' });
  };

  return Category;
};
