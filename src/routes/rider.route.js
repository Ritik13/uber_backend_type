const express = require('express');
const { createRider } = require('../controllers/rider.controller');

const riderRouter = express.Router();

riderRouter.post('/rider' , createRider);

module.exports = riderRouter
