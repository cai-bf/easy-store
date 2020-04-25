'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, DECIMAL } = Sequelize;
    await queryInterface.createTable('skus', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      goods_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'goods',
          key: 'id',
        },
      },
      price: {
        type: DECIMAL(12, 2),
        allowNull: false,
      },
      stock_num: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      sale_num: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      purchase_price: {
        type: DECIMAL(12, 2),
        allowNull: false,
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('skus');
  },
};
