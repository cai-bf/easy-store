'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT, DECIMAL } = Sequelize;
    await queryInterface.createTable('goods', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: {
        type: STRING(50),
        allowNull: false
      },
      pic: {
        type: TEXT,
        allowNull: false
      },
      description: {
        type: TEXT,
        allowNull: false
      },
      category_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      price: {
        type: DECIMAL(12, 2),
        allowNull: false
      },
      view: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stock: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('goods');
  }
};