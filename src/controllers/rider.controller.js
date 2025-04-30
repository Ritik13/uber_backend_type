const RiderRequest = require('../models/Rider.model')(require('../config/database'), require('sequelize').DataTypes);

const createRider = async (req, res) => {
    const { rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng } = req.body;

    if (!rider_id) {
      return res.status(400).json({ message: "Rider ID is required" });
    }

    const hasPendingRequest = await RiderRequest.findOne({
        where : {
            rider_id : rider_id,
            status: 'pending'
        }
    })

    if(hasPendingRequest)
        return res.status(400).json({ message: "Active ride request already exists." });

    try {
      const rider = await RiderRequest.create({
        rider_id,
        pickup_lat,
        pickup_lng,
        drop_lat,
        drop_lng
      });

      return res.status(201).json({ message: "Rider request created", data: rider });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
const getAllRiders = async (req, res) => {
    try {
        const Riders = await Rider.findAndCountAll();
        res.status(200).json({ message: "Riders Found", data: Riders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRiderById = async (req, res) => {
    const { id } = req.params;
    try {
        const Rider = await Rider.findOne({ where: { id } });
        if (!Rider) {
            return res.status(404).json({ message: "Rider not found" });
        }
        res.status(200).json({ message: "Rider Found", data: Rider });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const updateRiderById = async (req, res) => {
    const id = req.params.id;
    const { name, email, payout_account_id, total_earned, total_paid_out } = req.body;
    try {
        const [updated] = await Rider.update({ name, email, payout_account_id, total_earned, total_paid_out }, { where: { id } });
        if (updated === 0) {
            return res.status(404).json({ message: "Rider not found" });
        }

        const updatedRider = await Rider.findOne({ where: { id } });
        res.status(200).json({ message: "Rider updated", data: updatedRider });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
const deleteRiderById = async (req, res) => {
    const { id } = req.params;
    try {
        const Rider = await Rider.destroy({ where: { id } });
        if (!Rider) {
            return res.status(404).json({ message: "Rider not found" });
        }
        res.status(200).json({ message: "Rider Found", data: Rider });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createRider, getAllRiders, getRiderById, updateRiderById, deleteRiderById }
