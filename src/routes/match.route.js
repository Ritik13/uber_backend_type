const express = require('express');
const { matchRequest } = require('../controllers/match.controller');

const matchRouter = express.Router();

matchRouter.post('/match/rider' , matchRequest);

module.exports = matchRouter
