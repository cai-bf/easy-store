'use strict';

module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    const Category = app.model.define('category', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: {
            type: STRING(30),
            allowNull: false
        },
        parent_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '上级分类， 0表示没有上级'
        },
        created_at: DATE,
        updated_at: DATE,
    }, {
        underscored: true,
        tableName: 'categories'
    });

    Category.associate = () => {
        app.model.Category.hasMany(app.model.Category, { as: 'children', foreignKey: 'parent_id' });
        app.model.Category.belongsTo(app.model.Category, { as: 'parent', foreignKey: 'parent_id' });
        app.model.Category.hasMany(app.model.Goods, { as: 'goods', foreignKey: 'category_id' });
    }

    return Category;
};