const bcrypt = require('bcryptjs');
const db = require('../src/models/index.js').default;

const { User, Role, Permission } = db;

const SUPER_ADMIN = 'super admin';

const DEFAULT_PERMISSIONS = [
  { module: 'users', action: 'create' },
  { module: 'users', action: 'read' },
  { module: 'users', action: 'update' },
  { module: 'users', action: 'delete' },
  { module: 'roles', action: 'create' },
  { module: 'roles', action: 'read' },
  { module: 'roles', action: 'update' },
  { module: 'roles', action: 'delete' },
  { module: 'permissions', action: 'read' },
];

module.exports = {
  up: async () => {
    try {
      const [superAdminRole] = await Role.findOrCreate({
        where: { name: SUPER_ADMIN },
      });

      const permissionRecords = [];

      for (const perm of DEFAULT_PERMISSIONS) {
        const [permission] = await Permission.findOrCreate({
          where: { module: perm.module, action: perm.action },
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

        await User.create({
          name: 'super admin',
          email: adminEmail,
          password: hashedPassword,
          roleId: superAdminRole.id,
        });

        console.log('✅ SUPER ADMIN user created');
      }

      console.log('🎉 Initial seeding completed');
    } catch (err) {
      console.error('❌ Seeding failed:', err);
    }
  },

  down: async () => {
    await User.destroy({ where: { email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com' } });
    await Permission.destroy({ where: {} });
    await Role.destroy({ where: { name: SUPER_ADMIN } });
  },
};
