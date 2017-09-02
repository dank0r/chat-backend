'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Messages',
      'createdAt',
      {
        type: Sequelize.DATE,
      }
    );
    queryInterface.addColumn(
      'Messages',
      'updatedAt',
      {
        type: Sequelize.DATE,
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Messages', 'createdAt');
    queryInterface.removeColumn('Messages', 'updatedAt');
  }
};
