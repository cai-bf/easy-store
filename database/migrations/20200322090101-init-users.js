'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      avatar: {
        type: STRING(200),
        allowNull: false,
        defaultValue: "http://img3.imgtn.bdimg.com/it/u=1160348607,1578485562&fm=26&gp=0.jpg"
      },
      name: {
        type: STRING(30),
        allowNull: false
      },
      email: {
        type: STRING(40),
        allowNull: false
      },
      password: {
        type: STRING(128),
        allowNull: false
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
