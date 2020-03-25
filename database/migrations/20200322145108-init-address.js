'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, BOOLEAN } = Sequelize;
    await queryInterface.createTable('address', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      province: {
        type: STRING(30),
        allowNull: false
      },
      city: {
        type: STRING(30),
        allowNull: false
      },
      county: {
        type: STRING(30),
        allowNull: false
      },
      detail: {
        type: STRING(60),
        allowNull: false
      },
      name: {
        type: STRING(20),
        allowNull: false
      },
      phone: {
        type: STRING(18),
        allowNull: false
      },
      default: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('address');
  }
};