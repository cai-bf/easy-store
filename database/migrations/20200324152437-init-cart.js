'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('carts', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      sku_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'id',
        },
      },
      num: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('carts');
  },
};
