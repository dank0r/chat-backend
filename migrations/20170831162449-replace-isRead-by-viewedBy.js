'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Messages',
      'viewedBy',
      {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [],
        allowNull: false,
      }
    );
    queryInterface.removeColumn('Messages', 'isRead');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Messages',
      'isRead',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    );
    queryInterface.removeColumn('Messages', 'viewedBy');
  }
};
