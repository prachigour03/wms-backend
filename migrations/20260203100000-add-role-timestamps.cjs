'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('roles');

    if (!table.createdAt) {
      await queryInterface.addColumn('roles', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    if (!table.updatedAt) {
      await queryInterface.addColumn('roles', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('roles');

    if (table.updatedAt) {
      await queryInterface.removeColumn('roles', 'updatedAt');
    }

    if (table.createdAt) {
      await queryInterface.removeColumn('roles', 'createdAt');
    }
  },
};
