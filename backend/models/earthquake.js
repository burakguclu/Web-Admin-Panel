const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Earthquake = sequelize.define('Earthquake', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  depth: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  magnitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'earthquakes',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Earthquake; 