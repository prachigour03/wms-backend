import sequelize from './src/config/database.js';
async function check() {
  try {
    const [enums] = await sequelize.query("SELECT typname FROM pg_type WHERE typtype = 'e'");
    console.log('Enum types:', enums);
    for (const e of enums) {
        const [vals] = await sequelize.query(`SELECT enumlabel FROM pg_enum WHERE enumtypid = '${e.typname}'::regtype`);
        console.log(`Values for ${e.typname}:`, vals.map(v => v.enumlabel));
    }
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
check();
