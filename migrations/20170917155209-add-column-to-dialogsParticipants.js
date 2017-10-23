'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'DialogsParticipants',
      'isActive',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('DialogsParticipants', 'isActive');
  }
};
