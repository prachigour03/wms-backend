import db from "../src/models/index.js";
import permissionsModule from "../src/modules/roles/permissions.cjs";

const { allPermissionKeys } = permissionsModule;

export async function up() {
  const { Permission } = db;
  const permissions = allPermissionKeys
    .map((key) => {
      const [module, action] = key.split(":");
      if (!module || !action) return null;
      return { module, action };
    })
    .filter(Boolean);

  await Permission.bulkCreate(permissions, {
    ignoreDuplicates: true,
  });

  console.log("Permissions created");
}

export async function down() {
  const { Permission } = db;
  for (const key of allPermissionKeys) {
    const [module, action] = key.split(":");
    if (!module || !action) continue;
    await Permission.destroy({ where: { module, action } });
  }
}
