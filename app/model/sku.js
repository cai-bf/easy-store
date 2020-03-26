'use strict';

module.exports = app => {
    const { INTEGER, DATE, DECIMAL } = app.Sequelize;

    const Sku = app.model.define('sku', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        goods_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'goods',
                key: 'id'
            }
        },
        price: {
            type: DECIMAL(12, 2),
            allowNull: false
        },
        stock_num: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        sale_num: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        purchase_price: {
            type: DECIMAL(12, 2),
            allowNull: false
        },
        created_at: DATE,
        updated_at: DATE,
        deleted_at: DATE
    }, {
            underscored: true,
            paranoid: true,
            tableName: 'skus'
    });

    Sku.associate = () => {
        app.model.Sku.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id' });
        app.model.Sku.belongsToMany(app.model.Option, { as: 'category', through: app.model.SkuSpec });
        app.model.Sku.hasMany(app.model.SkuSpec, { as: 'sku_spec', foreignKey: 'sku_id' });
    }

    return Sku;
};