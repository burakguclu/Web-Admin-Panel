module.exports = (sequelize, Sequelize) => {
  const Earthquake = sequelize.define("earthquakes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE,
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
    depth: {
      type: Sequelize.DECIMAL(10, 2)
    },
    magnitude: {
      type: Sequelize.DECIMAL(3, 1),
      allowNull: false
    },
    location: {
      type: Sequelize.STRING
    },
    md: {
      type: Sequelize.DECIMAL(3, 1)
    },
    ml: {
      type: Sequelize.DECIMAL(3, 1)
    },
    mw: {
      type: Sequelize.DECIMAL(3, 1)
    },
    cityId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'cities',
        key: 'id'
      }
    }
  });

  return Earthquake;
}; 