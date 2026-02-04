import { ROLE_NAMES } from "../src/constants/roleEnum.js";
import crypto from "crypto";

export async function up(queryInterface) {
  const existing = await queryInterface.sequelize.query(
    'SELECT name FROM roles WHERE name IN (:names)',
    {
      replacements: { names: ROLE_NAMES },
      type: queryInterface.sequelize.QueryTypes.SELECT,
    }
  );

  const existingNames = new Set(existing.map((row) => row.name));
  const now = new Date();
  const rows = ROLE_NAMES.filter((name) => !existingNames.has(name)).map(
    (name) => ({
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
    })
  );

  if (rows.length === 0) return;

  await queryInterface.bulkInsert("roles", rows);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("roles", null, {});
}
