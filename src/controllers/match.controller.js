const matchRider = require('../service/matching.service');
const matchRetryQ = require('../queus/matchRetry.q');

const matchRequest = async (req, res) => {
  const { rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng } = req.body;

  const result = await matchRider({ rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng });

  if (result.success) {
    return res.status(200).json({ message: "Driver matched", driver_id: result.driver_id });
  }

  await matchRetryQ.add('retryMatch', {
    rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng
  }, {
    delay: 15000,
    attempts: 3,
    backoff: { type: 'fixed', delay: 15000 }
  });

  return res.status(404).json({ message: "No available driver nearby, retrying shortly" });
};

module.exports = { matchRequest };
