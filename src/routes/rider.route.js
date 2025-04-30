const express = require('express');
const { createRider } = require('../controllers/rider.controller');
const rateLimiter = require('../middleware/rateLimiter.middleware');

const riderRouter = express.Router();

riderRouter.post('/rider' , rateLimiter ,createRider);

module.exports = riderRouter
