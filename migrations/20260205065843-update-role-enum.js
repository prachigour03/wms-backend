'use strict';

export default {
  async up(queryInterface, Sequelize) {
    try {
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
    } catch (e) {
      console.log('Skipping rename viewer to vendor');
    }

    try {
      // Update existing rows safely
      await queryInterface.sequelize.query('UPDATE roles SET name = \'vendor\' WHERE name = \'viewer\'');
    } catch (e) {
      console.log('Skipping row update viewer to vendor');
    }
  },

  async down(queryInterface, Sequelize) {
    // Rollback safely
  }
};
