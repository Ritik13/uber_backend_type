const sequelize = require('../config/database');
const redis = require('../config/redis');
const Trip = require('../models/trips.model')(sequelize, require('sequelize').DataTypes);
const Driver = require('../models/Driver.model')(sequelize, require('sequelize').DataTypes);

const matchRider = async ({ rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng }) => {
  try {
    const nearbyDrivers = await redis.geosearch(
      'drivers_location',
      'FROMLONLAT',
      pickup_lng,
      pickup_lat,
      'BYRADIUS',
      5,
      'km',
      'ASC',
      'COUNT', 1
    );

    if (nearbyDrivers.length === 0) {
      return { success: false };
    }

    const driver_id = nearbyDrivers[0];
    const lockKey = `driver_lock:${driver_id}`;
    const lockAcq = await redis.set(lockKey, 'locked', 'NX', 'PX', 10000);

    if (!lockAcq) {
      const t = await sequelize.transaction();

      try {
        const driver = await Driver.findOne({
          where: { id: driver_id, status: 'available' },
          lock: t.LOCK.UPDATE,
          transaction: t
        });

        if (!driver) {
          await t.rollback();
          return { success: false };
        }

        await driver.update({ status: 'on_trip' }, { transaction: t });
        await Trip.create({
          rider_id,
          driver_id,
          pickup_lat,
          pickup_lng,
          drop_lat,
          drop_lng,
          status: 'in_progress'
        }, { transaction: t });

        await t.commit();
        await redis.zrem('drivers_location', driver_id);
        return { success: true, driver_id };

      } catch (err) {
        await t.rollback();
        return { success: false, error: err.message };
      }
    }

    // Redis lock succeeded, update and create trip
    await Driver.update(
      { status: 'on_trip' },
      { where: { id: driver_id } }
    );
    await Trip.create({
      rider_id,
      driver_id,
      pickup_lat,
      pickup_lng,
      drop_lat,
      drop_lng,
      status: 'in_progress'
    });
    await redis.zrem('drivers_location', driver_id);

    return { success: true, driver_id };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = matchRider;
