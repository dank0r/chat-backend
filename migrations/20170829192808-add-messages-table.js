'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'Messages',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        message: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: false,
          defaultValue: '',
        },
        author: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
          unique: false,
        },
        isRead: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        dialogID: {
          type: Sequelize.INTEGER,
          allowNull: false,
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('Messages')
  }
};
