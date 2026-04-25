'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop existing tables if they exist
    await queryInterface.dropTable('inward_challan_items').catch(() => {});
    await queryInterface.dropTable('inward_challans').catch(() => {});
    await queryInterface.dropTable('vendor_issue_material_items').catch(() => {});
    await queryInterface.dropTable('vendor_issue_materials').catch(() => {});
    await queryInterface.dropTable('material_consumption_items').catch(() => {});
    await queryInterface.dropTable('material_consumptions').catch(() => {});
    await queryInterface.dropTable('return_material_items').catch(() => {});
    await queryInterface.dropTable('return_materials').catch(() => {});

    // Drop ENUM types if they exist (Postgres specific)
    const dropEnumQueries = [
      'DROP TYPE IF EXISTS "enum_inward_challans_status"',
      'DROP TYPE IF EXISTS "enum_vendor_issue_materials_status"',
      'DROP TYPE IF EXISTS "enum_material_consumptions_status"',
      'DROP TYPE IF EXISTS "enum_return_materials_status"'
    ];

    for (const query of dropEnumQueries) {
      await queryInterface.sequelize.query(query).catch(() => {});
    }

    const commonHeaderFields = {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      subsidiary: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      store: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      site: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Draft', 'Confirmed', 'Cancelled'),
        defaultValue: 'Draft',
      },
      grandTotal: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      totalTax: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    };

    const commonItemFields = {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      workOrderNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      hsnSac: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lotNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      uom: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workCategory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      materialStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      useRate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rate: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      taxRate: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      taxAmount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      lineTotal: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },
      store: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    };

    // 1. Inward Challan
    await queryInterface.createTable('inward_challans', {
      ...commonHeaderFields,
      challanNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      customer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workOrderNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workOrderEndDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      shippedFrom: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shippedTo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transportationMode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicleNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      moNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lrNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tptId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tptName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deliveryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.createTable('inward_challan_items', {
      ...commonItemFields,
      inwardChallanId: {
        type: Sequelize.UUID,
        references: {
          model: 'inward_challans',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    // 2. Vendor Issue
    await queryInterface.createTable('vendor_issue_materials', {
      ...commonHeaderFields,
      issueNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      vendor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      issueType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.createTable('vendor_issue_material_items', {
      ...commonItemFields,
      vendorIssueMaterialId: {
        type: Sequelize.UUID,
        references: {
          model: 'vendor_issue_materials',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    // 3. Material Consumption
    await queryInterface.createTable('material_consumptions', {
      ...commonHeaderFields,
      consumptionNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      consumedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.createTable('material_consumption_items', {
      ...commonItemFields,
      materialConsumptionId: {
        type: Sequelize.UUID,
        references: {
          model: 'material_consumptions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    // 4. Return Material
    await queryInterface.createTable('return_materials', {
      ...commonHeaderFields,
      returnNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      returnFrom: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      returnType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.createTable('return_material_items', {
      ...commonItemFields,
      returnMaterialId: {
        type: Sequelize.UUID,
        references: {
          model: 'return_materials',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('return_material_items');
    await queryInterface.dropTable('return_materials');
    await queryInterface.dropTable('material_consumption_items');
    await queryInterface.dropTable('material_consumptions');
    await queryInterface.dropTable('vendor_issue_material_items');
    await queryInterface.dropTable('vendor_issue_materials');
    await queryInterface.dropTable('inward_challan_items');
    await queryInterface.dropTable('inward_challans');
  },
};
