'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Sessions',
      'uuid',
      {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      }
    );
    queryInterface.removeColumn('Sessions', 'session');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Sessions', 'uuid');
    queryInterface.addColumn(
      'Sessions',
      'session',
      {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      }
    );
  }
};
