const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Earthquake = sequelize.define('Earthquake', {
  id: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  depth: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  magnitude: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'earthquakes',
  timestamps: true,
  charset: 'utf8mb4',
  engine: 'InnoDB',
  modelOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  indexes: [
    {
      name: 'idx_date',
      fields: ['date']
    },
    {
      name: 'idx_magnitude',
      fields: ['magnitude']
    }
  ]
});

Earthquake.afterSync(async () => {
  await sequelize.query(`
    ALTER TABLE earthquakes 
    CONVERT TO CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;
  `);
});

module.exports = Earthquake; 