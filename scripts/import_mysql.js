/**
 * SmartStation - MySQL Importer
 * Automatically imports smartstation_schema.sql into MySQL Server 8.0
 * Run with: node scripts/import_mysql.js [password]
 * Example:  node scripts/import_mysql.js root123
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mysqlPath = 'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe';
const sqlFile = path.join(__dirname, '..', 'smartstation_schema.sql');

const password = process.argv[2] || process.env.MYSQL_PWD || '';

if (!fs.existsSync(mysqlPath)) {
  console.error(`❌ MySQL executable not found at: ${mysqlPath}`);
  console.log('If installed in a different location, please adjust the path or import smartstation_schema.sql using MySQL Workbench / phpMyAdmin.');
  process.exit(1);
}

if (!fs.existsSync(sqlFile)) {
  console.error(`❌ SQL file not found at: ${sqlFile}`);
  console.log('Run `npm run db:sql` first to generate the SQL file.');
  process.exit(1);
}

console.log('\n======================================================');
console.log('   SmartStation - MySQL 8.0 Direct Database Importer  ');
console.log('======================================================\n');

try {
  const pArg = password ? ` -p"${password}"` : '';

  console.log('1. Creating database `smartstation` if not exists...');
  execSync(`"${mysqlPath}" -u root${pArg} -e "CREATE DATABASE IF NOT EXISTS smartstation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`, { stdio: 'inherit' });

  console.log('2. Importing schema and inserting seed records from smartstation_schema.sql...');
  execSync(`"${mysqlPath}" -u root${pArg} smartstation < "${sqlFile}"`, { stdio: 'inherit' });

  console.log('\n✅ Successfully imported all tables and data into MySQL `smartstation` database!\n');
} catch (err) {
  console.error('\n❌ MySQL Import Error:');
  console.error(err.message || err);
  console.log('\nTip: If your MySQL root user has a password, pass it as an argument:');
  console.log('   node scripts/import_mysql.js <your_root_password>\n');
}
