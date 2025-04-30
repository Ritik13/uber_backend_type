const redis = require("../config/redis");

const rateLimiter = async (req, res, next) => {
    const windowSize = 10;
    const MAX_REQUESTS = 3;
    const key = `rate:rider:${req.body.rider_id || req.ip}`;
    const current = await redis.incr(key);
    if (current === 1) {
        await redis.expire(key, windowSize);
    }
    if (current > MAX_REQUESTS) {
        return res.status(429).json({ message: "Too many requests. Please wait." });
    }
    next();
}

module.exports = rateLimiter
