const { Pool } = require('pg');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTables(mysqlConnection) {
  console.log('Tablolar oluşturuluyor...');
  
  try {
    // Önce bağımlı tabloları sil
    console.log('Bağımlı tablolar siliniyor...');
    await mysqlConnection.execute('DROP TABLE IF EXISTS notifications');
    await mysqlConnection.execute('DROP TABLE IF EXISTS devices');
    await mysqlConnection.execute('DROP TABLE IF EXISTS cities');
    await mysqlConnection.execute('DROP TABLE IF EXISTS users');

    // Sonra ana tabloları oluştur
    console.log('Users tablosu oluşturuluyor...');
    await mysqlConnection.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    console.log('Cities tablosu oluşturuluyor...');
    await mysqlConnection.execute(`
      CREATE TABLE cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        latitude FLOAT,
        longitude FLOAT,
        population INT,
        region VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    console.log('Devices tablosu oluşturuluyor...');
    await mysqlConnection.execute(`
      CREATE TABLE devices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        lastMaintenance TIMESTAMP NULL,
        nextMaintenance TIMESTAMP NULL,
        cityId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cityId) REFERENCES cities(id)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    console.log('Notifications tablosu oluşturuluyor...');
    await mysqlConnection.execute(`
      CREATE TABLE notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        isRead BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    console.log('Tablolar başarıyla oluşturuldu!');
  } catch (error) {
    console.error('Tablo oluşturma hatası:', error);
    throw error;
  }
}

// MySQL bağlantı havuzu oluştur
async function createMySQLPool(config) {
  try {
    const pool = mysql.createPool({
      ...config,
      multipleStatements: true,
      connectionLimit: 10,
      waitForConnections: true,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      maxIdle: 10,
      idleTimeout: 60000,
      charset: 'utf8mb4'
    });

    // Test bağlantısı
    const connection = await pool.getConnection();
    console.log('MySQL bağlantı havuzu oluşturuldu');
    connection.release();
    return pool;
  } catch (error) {
    console.error('MySQL bağlantı havuzu oluşturma hatası:', error);
    throw error;
  }
}

async function migrateTable(pgPool, mysqlConnection, tableName, query, transformRow = row => Object.values(row)) {
  console.log(`${tableName} verileri aktarılıyor...`);
  const { rows } = await pgPool.query(`SELECT * FROM ${tableName}`);
  console.log(`${rows.length} adet kayıt bulundu.`);

  let transferred = 0;
  let errors = 0;
  const maxRetries = 3;

  for (const row of rows) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const values = transformRow(row);
        await mysqlConnection.execute(query, values);
        transferred++;
        if (transferred % 10 === 0) {
          console.log(`${transferred}/${rows.length} kayıt aktarıldı...`);
        }
        break;
      } catch (error) {
        retries++;
        console.error(`${tableName} tablosunda kayıt aktarılırken hata (Deneme ${retries}/${maxRetries}):`, {
          row,
          error: error.message
        });
        if (retries === maxRetries) {
          errors++;
          console.error(`${tableName} tablosunda kayıt aktarılamadı:`, row);
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  console.log(`${tableName} tablosu için ${transferred} kayıt aktarıldı, ${errors} kayıt başarısız.`);
  return transferred;
}

async function migrateData() {
  console.log('Veri taşıma işlemi başlatılıyor...');
  
  const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectTimeout: 60000,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  };

  let pgPool;
  let mysqlPool;

  try {
    // PostgreSQL bağlantısı
    pgPool = new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT
    });
    await pgPool.connect();
    console.log('PostgreSQL bağlantısı başarılı!');

    // MySQL bağlantı havuzu
    mysqlPool = await createMySQLPool(mysqlConfig);
    
    // Tabloları oluştur
    await createTables(mysqlPool);

    // Veri aktarımı işlemleri için bağlantı havuzunu kullan
    const migrateTableWithPool = async (tableName, query, transformRow) => {
      const connection = await mysqlPool.getConnection();
      try {
        await migrateTable(pgPool, connection, tableName, query, transformRow);
      } finally {
        connection.release();
      }
    };

    // Cities tablosu için özel dönüştürme fonksiyonu
    const transformCityRow = (row) => [
      row.id,
      row.name,
      row.latitude === null ? 0 : parseFloat(row.latitude),
      row.longitude === null ? 0 : parseFloat(row.longitude),
      row.population || 0,
      row.region || '',
      row.createdAt || new Date(),
      row.updatedAt || new Date()
    ];

    // Diğer tablolar için benzer dönüşüm fonksiyonları
    const transformUserRow = (row) => [
      row.id,
      row.username || '',
      row.email || '',
      row.password || '',
      row.role || 'user',
      row.createdAt || new Date(),
      row.updatedAt || new Date()
    ];

    const transformDeviceRow = (row) => [
      row.id,
      row.name || '',
      row.type || '',
      row.location || '',
      row.status || 'active',
      row.lastMaintenance || null,
      row.nextMaintenance || null,
      row.cityId || null,
      row.createdAt || new Date(),
      row.updatedAt || new Date()
    ];

    const transformNotificationRow = (row) => [
      row.id,
      row.userId || null,
      row.title || '',
      row.message || '',
      row.type || 'info',
      row.isRead || false,
      row.createdAt || new Date(),
      row.updatedAt || new Date()
    ];

    // Tabloları migrate et
    await migrateTableWithPool(
      'cities',
      'INSERT INTO cities (id, name, latitude, longitude, population, region, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      transformCityRow
    );

    await migrateTableWithPool(
      'users',
      'INSERT INTO users (id, username, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      transformUserRow
    );

    await migrateTableWithPool(
      'devices',
      'INSERT INTO devices (id, name, type, location, status, lastMaintenance, nextMaintenance, cityId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      transformDeviceRow
    );

    await migrateTableWithPool(
      'notifications',
      'INSERT INTO notifications (id, userId, title, message, type, isRead, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      transformNotificationRow
    );

    // Veri aktarımı tamamlandıktan sonra riskLevel sütununu ekle
    await mysqlPool.execute(`
      ALTER TABLE cities 
      ADD COLUMN riskLevel VARCHAR(50) DEFAULT 'low' AFTER region;
    `);

    console.log('Tüm tablolar başarıyla migrate edildi!');
  } catch (error) {
    console.error('Veri taşıma sırasında hata:', error);
    console.error('Hata detayları:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  } finally {
    if (pgPool) {
      console.log('PostgreSQL bağlantısı kapatılıyor...');
      await pgPool.end();
    }
    if (mysqlPool) {
      console.log('MySQL bağlantı havuzu kapatılıyor...');
      await mysqlPool.end();
    }
  }
}

migrateData().catch(console.error); 