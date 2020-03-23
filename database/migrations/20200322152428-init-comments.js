'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('comments', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'users',
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
      item_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        }
      },
      content: {
        type: STRING(400),
        allowNull: false
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('comments');
  }
};
