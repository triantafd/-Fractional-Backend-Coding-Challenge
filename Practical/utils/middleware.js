const logger = require('./logger')
const { con } = require('../database/dbConfig')
const util = require('util');

let windowMs = 1 * 60 * 1000 //10 minutes
let maxUsage = 5

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const customRateLimiter = async (req, res, next) => {
  let curDate = Date.now()
  let windowDate = curDate - windowMs;

  try {
    var { api_key } = req.query;
    if (!api_key) {
      const error = new Error('The parameter to query the key is api_key');
      error.name = 'WRONG_QUERY';
      throw error;
    }
  } catch (err) {
    return next(err)
  }

  const query = util.promisify(con.query).bind(con);
  var sql = `SELECT id FROM myfracdb.apikey WHERE api_key='${api_key}'`;
  let apiId;

  try {
    let res = await query(sql);
    if (!res[0]) {
      const error = new Error('Api Key Doesnt Exist');
      error.name = 'WRONG_API_KEY';
      throw error;
    }
    apiId = (JSON.parse(JSON.stringify(res[0])).id);
  } catch (err) {
    next(err)
  }

  var sql = `SELECT SUM(weight) AS totalWeight  FROM myfracdb.apikeyhistory WHERE api_id=${apiId} AND time>${windowDate}`;
  var apiUsage;
  try {
    let res = await query(sql);
    apiUsage = (JSON.parse(JSON.stringify(res[0])).totalWeight)
    if (apiUsage >= maxUsage) {
      const error = new Error('API KEY MAX USAGE');
      error.name = 'API_KEY_MAX_USAGE';
      throw error;
    }
  } catch (err) {
    next(err)
  }

  try {
    var sql = `INSERT INTO myfracdb.apikeyhistory(api_id, weight, time) VALUES (${apiId}, 1, ${curDate})`;
    await query(sql);
  } catch (err) {
    next(err)
  }

  next();
}

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({
    error: 'unknown endpoint'
  })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.name)

  if (error.name === 'WRONG_API_KEY') {
    return res.status(400).send({
      error: 'Api_key error, you are using a wrong api key'
    })
  } else if (error.name === 'WRONG_NUMBER') {
    return res.status(400).send({
      error: 'WRONG_NUMBER error, you are using a number that doesnt exist'
    })
  } else if (error.name === 'WRONG_QUERY') {
    return res.status(400).send({
      error: 'WRONG_QUERY error, you are using a wrong query parameter for api key'
    })
  } else if (error.name === 'WRONG_INPUT') {
    return res.status(400).send({
      error: 'WRONG_INPUT error, the input is not a telephone number'
    })
  } else if (error.name === 'API_KEY_MAX_USAGE') {
    return res.status(429).send({
      error: 'API_KEY_MAX_USAGE, slow down your requests'
    })
  }
  next(error)
}

module.exports = { customRateLimiter, errorHandler, unknownEndpoint, requestLogger }