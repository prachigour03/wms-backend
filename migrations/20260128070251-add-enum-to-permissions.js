export async function up(queryInterface, Sequelize) {
  // 1️⃣ MODULE ENUM
  await queryInterface.changeColumn("permissions", "module", {
    type: Sequelize.ENUM(
        "users",
  "roles",
  "permissions",
  "account_types",
  "order_bookings",
  "inventory_counts",
  "inward_challans",
  "material_consumptions",
  "return_materials",
  "vendor_bills",
  "vendor_issue_materials",
  "admin_profiles",
  "states",
  "cities",
  "locations",
  "departments",
  "currencies",
  "subsidiaries",
  "teams",
  "system_logs",
  "settings",
  "company_details",
  "chart_of_accounts",
  "customers",
  "items",
  "item_groups",
  "employees",
  "warehouses",
  "vendors",
  "role_permissions",
    ),
    allowNull: false,
  });

  // 2️⃣ ACTION ENUM (CRUD)
  await queryInterface.changeColumn("permissions", "action", {
    type: Sequelize.ENUM("CREATE", "READ", "UPDATE", "DELETE"),
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  // 3️⃣ Revert to STRING (safe rollback)
  await queryInterface.changeColumn("permissions", "module", {
    type: Sequelize.STRING,
    allowNull: false,
  });

  await queryInterface.changeColumn("permissions", "action", {
    type: Sequelize.STRING,
    allowNull: false,
  });
}
