const {Queue} = require('bullmq');
const redis = require('../config/redis');


const matchRetryQ = new Queue('mathRetryQ' , {connection: redis});
module.exports = matchRetryQ
