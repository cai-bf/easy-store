'use strict';

module.exports = app => {
    const { STRING, DATE, INTEGER } = app.Sequelize;

    const User = app.model.define('users', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: STRING(30),
        email: STRING(40),
        password: STRING(128),
        created_at: DATE,
        updated_at: DATE,
    });

    return User;
};