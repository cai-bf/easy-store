'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
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
      goods_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'goods',
          key: 'id'
        }
      },
      num: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1
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
