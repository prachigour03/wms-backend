'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Only rename 'staff' → 'employee', since 'vendor' already exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_enum 
          WHERE enumlabel = 'viewer' AND enumtypid = 'enum_roles_name'::regtype
        ) THEN
          ALTER TYPE "enum_roles_name" RENAME VALUE 'viewer' TO 'vendor';
        END IF;
      END
      $$;
    `);

    // Update existing rows
    await queryInterface.bulkUpdate('roles', { name: 'vendor' }, { name: 'viewer' });
  },

  async down(queryInterface, Sequelize) {
    // Rollback 'employee' → 'staff' safely
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_enum 
          WHERE enumlabel = 'employee' AND enumtypid = 'enum_roles_name'::regtype
        ) THEN
          ALTER TYPE "enum_roles_name" RENAME VALUE 'vendor' TO 'viewer';
        END IF;
      END
      $$;
    `);

    await queryInterface.bulkUpdate('roles', { name: 'viewer' }, { name: 'vendor' });
  }
};
