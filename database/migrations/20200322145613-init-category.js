'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('categories', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: {
        type: STRING(30),
        allowNull: false
      },
      parent_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '上级分类， 0表示没有上级'
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('categories');
  }
};