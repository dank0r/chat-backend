'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'DialogsParticipants',
      'createdAt',
      {
        type: Sequelize.DATE,
      }
    );
    queryInterface.addColumn(
      'DialogsParticipants',
      'updatedAt',
      {
        type: Sequelize.DATE,
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('DialogsParticipants', 'createdAt');
    queryInterface.removeColumn('DialogsParticipants', 'updatedAt');
  }
};
