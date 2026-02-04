const CRUD_ACTIONS = ['create', 'read', 'update', 'delete'];

const CRUD_MODULES = [
  // Core RBAC
  'users',
  'roles',
  'permissions',
  'notifications',

  // Setup
  'company_details',
  'currencies',
  'states',
  'departments',
  'locations',
  'cities',
  'subsidiaries',
  'teams',
  'system_logs',
  'settings',

  // Master
  'account_types',
  'chart_of_accounts',
  'customers',
  'items',
  'item_groups',
  'employees',
  'warehouses',
  'vendors',

  // O2C & Transition
  'order_bookings',
  'inventory_counts',
  'inward_challans',
  'material_consumptions',
  'return_materials',
  'vendor_bills',
  'vendor_issue_materials',

  // Generic commerce
  'products',
  'product_categories',
  'orders',
  'reports',

  // Profile
  'admin_profiles',
];

const allPermissions = {
  // Dashboard
  'dashboard:access': 'Access Dashboard',
  'dashboard:stats': 'View Dashboard Stats',

  // Users (extras)
  'users:export': 'Export Users',
  'users:impersonate': 'Impersonate Users',

  // Roles & Permissions (extras)
  'permissions:assign': 'Assign Permissions to Roles',

  // Products (extras)
  'products:export': 'Export Products',

  // Orders (extras)
  'orders:export': 'Export Orders',

  // Customers (extras)
  'customers:export': 'Export Customers',

  // Vendors (extras)
  'vendors:export': 'Export Vendors',

  // Reports (extras)
  'reports:access': 'Access Reports',
  'reports:export': 'Export Reports',

  // Profile (Self)
  'profile:read': 'Read Own Profile',
  'profile:update': 'Update Own Profile',
};

const toTitle = (value) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

CRUD_MODULES.forEach((module) => {
  CRUD_ACTIONS.forEach((action) => {
    const key = `${module}:${action}`;
    if (!allPermissions[key]) {
      const label = `${action.charAt(0).toUpperCase() + action.slice(1)} ${toTitle(module)}`;
      allPermissions[key] = label;
    }
  });
});

const groupedPermissions = Object.keys(allPermissions).reduce((acc, permission) => {
  const [module] = permission.split(':');
  if (!acc[module]) {
    acc[module] = [];
  }
  acc[module].push({ key: permission, description: allPermissions[permission] });
  return acc;
}, {});

module.exports = {
  allPermissions,
  groupedPermissions,
  allPermissionKeys: Object.keys(allPermissions),
};
