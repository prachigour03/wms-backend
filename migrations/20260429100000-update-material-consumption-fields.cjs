'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('material_consumptions', 'type', {
      type: Sequelize.ENUM('Vendor', 'Employee'),
      defaultValue: 'Vendor'
    });
    await queryInterface.addColumn('material_consumptions', 'vendorEmployeeName', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('material_consumptions', 'type');
    await queryInterface.removeColumn('material_consumptions', 'vendorEmployeeName');
    // Note: Dropping ENUM type might be needed in Postgres
  }
};
