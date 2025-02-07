const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    timezone: '+03:00',
    dialectOptions: {
      charset: 'utf8mb4',
      ssl: false,
      connectTimeout: 60000
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      match: [
        /Deadlock/i,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/,
        /ConnectionError/
      ],
      max: 3
    },
    logging: false
  }
);

// Bağlantıyı test et
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Veritabanı bağlantısı başarılı.');

    // Karakter seti ayarlarını uygula
    await sequelize.query(`
      SET NAMES utf8mb4;
      SET CHARACTER SET utf8mb4;
      SET CHARACTER_SET_CONNECTION=utf8mb4;
    `);
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    setTimeout(testConnection, 5000);
  }
}

testConnection();

module.exports = sequelize; 