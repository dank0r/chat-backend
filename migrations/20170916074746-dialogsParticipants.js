'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'DialogsParticipants',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userID: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        dialogID: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('DialogsParticipants')
  }
};
