require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  PORT: process.env.DB_PORT || 5432,
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "123",
  DB: process.env.DB_NAME || "admin_panel_db",
  schema: process.env.DB_SCHEMA || "public",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typeCast: true
  },
  timezone: '+03:00'
}; 