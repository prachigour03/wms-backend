const bcrypt = require('bcryptjs');

const SUPER_ADMIN = 'super admin';
const { allPermissionKeys } = require('../modules/roles/permissions.cjs');

module.exports = {
  up: async () => {
    const db = (await import('../models/index.js')).default;
    const { User, Role, Permission } = db;
    try {
      const [superAdminRole] = await Role.findOrCreate({
        where: { name: SUPER_ADMIN },
      });

      const permissionRecords = [];

      for (const key of allPermissionKeys) {
        const [module, action] = key.split(':');
        if (!module || !action) continue;

        const [permission] = await Permission.findOrCreate({
          where: { module, action },
        });
        permissionRecords.push(permission);
      }

      await superAdminRole.setPermissions(permissionRecords);

      const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@example.com';
      const adminExists = await User.findOne({ where: { email: adminEmail } });

      if (!adminExists) {
        const hashedPassword = await bcrypt.hash(
          process.env.SUPER_ADMIN_PASSWORD || 'Admin@123',
          10
        );

        const user = await User.create({
          name: 'super admin',
          email: adminEmail,
          password: hashedPassword,
          roleId: superAdminRole.id,
        });

        console.log('✅ SUPER ADMIN user created', user.toJSON());
      }

      console.log('🎉 Initial seeding completed');
    } catch (err) {
      console.error('❌ Seeding failed:', err);
    }
  },

  down: async () => {
    const db = (await import('../models/index.js')).default;
    const { User, Role, Permission } = db;
    await User.destroy({ where: { email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com' } });
    await Permission.destroy({ where: {} });
    await Role.destroy({ where: { name: SUPER_ADMIN } });
  },
};
