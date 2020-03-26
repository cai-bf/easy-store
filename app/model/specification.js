'use strict';

module.exports = app => {
    const { DATE, INTEGER, STRING } = app.Sequelize;

    const Specification = app.model.define('specification', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        goods_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'goods',
                key: 'id'
            }
        },
        name: {
            type: STRING(20),
            allowNull: false
        },
        created_at: DATE,
        updated_at: DATE,
    }, {
            underscored: true,
            tableName: 'specifications'
    });

    Specification.associate = () => {
        app.model.Specification.belongsTo(app.model.Goods, { as: 'goods', foreignKey: 'goods_id' });
        app.model.Specification.hasMany(app.model.Option, { as: 'options', foreignKey: 'spec_id' });
        app.model.Specification.hasMany(app.model.SkuSpec, { as: 'sku_specs', foreignKey: 'spec_id' });
    }

    return Specification;
};