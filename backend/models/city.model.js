module.exports = (sequelize, Sequelize) => {
  const City = sequelize.define("cities", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 6),
      allowNull: false
    },
    longitude: {
      type: Sequelize.DECIMAL(10, 6),
      allowNull: false
    },
    population: {
      type: Sequelize.INTEGER
    },
    region: {
      type: Sequelize.STRING
    },
    riskLevel: {
      type: Sequelize.ENUM('low', 'medium', 'high'),
      defaultValue: 'low'
    }
  });

  return City;
}; 