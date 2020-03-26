'use strict';

module.exports = app => {
    const { DATE, INTEGER, STRING } = app.Sequelize;

    const Option = app.model.define('option', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        spec_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'specifications',
                key: 'id'
            }
        },
        name: {
            type: STRING(30),
            allowNull: false
        },
        created_at: DATE,
        updated_at: DATE,
    }, {
            underscored: true,
            tableName: 'options'
    });

    Option.associate = () => {
        app.model.Option.belongsTo(app.model.Specification, { as: 'specification', foreignKey: 'spec_id' });
        app.model.Option.belongsToMany(app.model.Sku, { as: 'skus', through: app.model.SkuSpec });
        app.model.Option.hasMany(app.model.SkuSpec, { as: 'sku_specs', foreignKey: 'option_id' });
    }

    return Option;
};