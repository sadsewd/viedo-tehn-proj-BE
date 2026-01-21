import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// user: process.env.MYSQLUSER || 'root',
// host: process.env.MYSQLHOST || 'localhost',
// password: process.env.MYSQLPASSWORD || 'root',
// database: process.env.MYSQLDATABASE || 'db',
// port: process.env.MYSQLPORT || '3306',

const db = mysql.createConnection({
  user: process.env.MYSQLUSER || 'root',
  host: process.env.MYSQLHOST || 'localhost',
  password: process.env.MYSQLPASSWORD || 'root',
  database: process.env.MYSQLDATABASE || 'db',
  port: process.env.MYSQLPORT || '3306',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
});

export default db;
