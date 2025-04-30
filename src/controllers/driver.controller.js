const redis = require('../config/redis');

const Driver = require('../models/Driver.model')(require('../config/database'), require('sequelize').DataTypes);


const driverCheckin = async (req, res) => {
    const { driver_id
        , current_lat
        , current_lng } = req.body;

    const recordExist = await Driver.findOne({ where: { id: driver_id } });
    if (recordExist) {
        await Driver.update({
           current_lat
            , current_lng,
            status: 'available'
        }, { where: { id: driver_id } });
        await redis.geoadd(
          'drivers_location', // Redis key
          current_lng,         // Important: longitude first
          current_lat,         // then latitude
          driver_id            // driver id as value
        );
        return res.status(201).json({ message: "Driver updateed" });

    } else {
        try {
            const driver = await Driver.create({
                id: driver_id
                , current_lat
                , current_lng,
                status: 'available'
            });
            await redis.geoadd(
              'drivers_location', // Redis key
              current_lng,         // Important: longitude first
              current_lat,         // then latitude
              driver_id            // driver id as value
            );
            return res.status(201).json({ message: "Driver request created", data: driver });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
const driverLocation = async (req, res) => {
    const { driver_id, current_lat, current_lng } = req.body;

    try {
      const driver = await Driver.findOne({ where: { id: driver_id } });

      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      await Driver.update(
        { current_lat, current_lng },
        { where: { id: driver_id } }
      );

      return res.status(200).json({ message: "Driver location updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


const driverCheckout = async (req, res) => {
    const { driver_id } = req.body;

    try {
      const driver = await Driver.findOne({ where: { id: driver_id } });

      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      await Driver.update(
        { status: 'unavailable' },
        { where: { id: driver_id } }
      );

      return res.status(200).json({ message: "Driver checked out successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };


module.exports = { driverCheckin, driverCheckout, driverLocation }
