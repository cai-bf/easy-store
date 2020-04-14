'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('specifications', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      goods_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'goods',
          key: 'id',
        },
      },
      name: {
        type: STRING(20),
        allowNull: false,
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('specifications');
  },
};
