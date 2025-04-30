const express = require('express');
const { driverCheckin , driverLocation , driverCheckout} = require('../controllers/driver.controller');

const driverRouter = express.Router();

driverRouter.post('/driver/checkin' , driverCheckin);
driverRouter.post('/driver/location' , driverLocation);
driverRouter.post('/driver/checkout' , driverCheckout);


module.exports = driverRouter
