const sequelize = require('../config/database');
const redis = require('../config/redis');

const Driver = require('../models/Driver.model')(require('../config/database'), require('sequelize').DataTypes);
const matchRequest = async (req, res) => {
  const { pickup_lat, pickup_lng } = req.body;
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

    if (nearbyDrivers.length > 0) {
      const lockKey = `driver_lock:${nearbyDrivers[0]}`;
      const lockAcq = await redis.set(lockKey, 'locked', 'NX', "PX", 10000);
      if (!lockAcq) {
        const t = await sequelize.transaction();

        try {
          const driver = await Driver.findOne({
            where: { id: nearbyDrivers[0], status: 'available' },
            lock: t.LOCK.UPDATE,
            transaction: t
          });

          if (!driver) {
            await t.rollback();
            return res.status(409).json({ message: "Driver already taken (DB fallback failed)." });
          }

          await driver.update({ status: 'on_trip' }, { transaction: t });
          await t.commit();

          return res.status(200).json({ message: "Driver matched via DB fallback", driver_id: driver.id });

        } catch (err) {
          await t.rollback();
          return res.status(500).json({ error: "Locking failed in fallback DB flow", detail: err.message });
        }
      }
      await redis.zrem('drivers_location', nearbyDrivers[0]); // remove driver from further matche
      await Driver.update(
        { status: 'on_trip' },
        { where: { id: nearbyDrivers[0] } }
      );
      return res.status(200).json({ message: "Driver matched successfully", driver_id: nearbyDrivers[0] });
    } else {
      return res.status(404).json({ message: "No available driver nearby" });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { matchRequest }
