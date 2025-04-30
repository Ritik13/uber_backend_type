const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {}

  Trip.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rider_id: DataTypes.UUID,
    driver_id: DataTypes.UUID,
    pickup_lat: DataTypes.FLOAT,
    pickup_lng: DataTypes.FLOAT,
    drop_lat: DataTypes.FLOAT,
    drop_lng: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM('in_progress', 'completed', 'cancelled'),
      defaultValue: 'in_progress'
    }
  }, {
    sequelize,
    modelName: 'Trip',
    tableName: 'Trips',
    underscored: true
  });

  return Trip;
};
