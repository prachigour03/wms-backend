'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Update Header Table
    await queryInterface.addColumn('vendor_issue_materials', 'type', {
      type: Sequelize.ENUM('Vendor', 'Employee'),
      defaultValue: 'Vendor'
    });
    await queryInterface.addColumn('vendor_issue_materials', 'issuedTo', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_issue_materials', 'team', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_issue_materials', 'customer', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_issue_materials', 'supervisorName', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // 2. Update Item Table
    await queryInterface.addColumn('vendor_issue_material_items', 'availableQty', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0
    });
    await queryInterface.addColumn('vendor_issue_material_items', 'qtyIssued', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0
    });
    await queryInterface.addColumn('vendor_issue_material_items', 'useRateCalc', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('vendor_issue_material_items', 'serviceType', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_issue_material_items', 'elementNo', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_issue_material_items', 'ticketSrNo', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_issue_material_items', 'fatNo', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('vendor_issue_material_items', 'itemRemarks', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert columns if needed
  }
};
