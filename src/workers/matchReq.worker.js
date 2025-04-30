const { Worker } = require('bullmq');
const redis = require('../config/redis');
const matchRider = require('../services/matching.service');

const worker = new Worker('matchRetryQueue', async (job) => {
  const { rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng } = job.data;

  console.log(`[Worker] Retrying match for rider: ${rider_id}`);

  const result = await matchRider({ rider_id, pickup_lat, pickup_lng, drop_lat, drop_lng });

  if (result.success) {
    console.log(`[Worker] ✅ Match succeeded: driver_id = ${result.driver_id}`);
  } else {
    console.log(`[Worker] ❌ Match failed on retry attempt ${job.attemptsMade + 1}`);
  }

}, {
  connection: redis,
  concurrency: 2 // optional: number of parallel jobs
});
