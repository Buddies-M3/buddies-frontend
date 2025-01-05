import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.NEXT_PUBLIC_DB_HOST,
  port: process.env.NEXT_PUBLIC_DB_PORT,
  user: process.env.NEXT_PUBLIC_DB_USER, // Replace with your MySQL username
  password: process.env.NEXT_PUBLIC_DB_PASSWORD, // Replace with your MySQL password
  database: process.env.NEXT_PUBLIC_DB_NAME, // Database name
});

export default pool;