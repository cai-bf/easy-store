'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('sku_spec', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      sku_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'id'
        }
      },
      spec_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'specifications',
          key: 'id'
        }
      },
      option_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'options',
          key: 'id'
        }
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sku_spec');
  }
};