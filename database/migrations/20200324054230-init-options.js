'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('options', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      spec_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'specifications',
          key: 'id',
        },
      },
      name: {
        type: STRING(30),
        allowNull: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('options');
  },
};
