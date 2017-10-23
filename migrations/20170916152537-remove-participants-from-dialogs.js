'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Dialogs', 'participants');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Dialogs',
      'participants',
      {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [],
        allowNull: false,
      }
    );
  }
};
