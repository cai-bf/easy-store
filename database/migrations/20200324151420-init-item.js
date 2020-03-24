'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, DECIMAL } = Sequelize;
    await queryInterface.createTable('items', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      order_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'order',
          key: 'id'
        }
      },
      sku_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'id'
        }
      },
      num: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      price: {
        type: DECIMAL(12, 2),
        allowNull: false
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('items');
  }
};
