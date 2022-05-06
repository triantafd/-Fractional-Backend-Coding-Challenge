const express = require('express');
const bodyParser = require('body-parser');
const phoneRouter = express.Router();
phoneRouter.use(bodyParser.json());
const { customRateLimiter } = require('../utils/middleware')
const { con } = require('../database/dbConfig')
const util = require('util');

function onlyNumbers(str) {
  return /^[0-9]+$/.test(str);
}

phoneRouter.route('/phone/:phoneNumber')
  .get(customRateLimiter, async (req, res, next) => {
    const query = util.promisify(con.query).bind(con);
    let phone = req.params.phoneNumber;
    let allPhoneData;

    try {
      phone = req.params.phoneNumber;
      if (phone.length < 5 || phone.length > 12 || !onlyNumbers(phone)) {
        const error = new Error('This is not a Number');
        error.name = 'WRONG_INPUT';
        throw error;
      }
    } catch (err) {
      return next(err)
    }

    for (i = 2; i < 4; i++) {
      var sql = `SELECT * FROM myfracdb.msisdn WHERE countryCode='${phone.slice(0, i)}'`;
      try {
        allPhoneData = await query(sql);
      } catch (err) {
        next(err)
      }
      if (allPhoneData[0]) break;
    }

    try {
      if (!allPhoneData[0]) {
        const error = new Error('This Number Doesnt Exist');
        error.name = 'WRONG_NUMBER';
        throw error;
      }
    } catch (err) {
      return next(err)
    }

    let allPhoneDataJson = JSON.parse(JSON.stringify(allPhoneData));
    let allSubscriberNumbers = allPhoneDataJson.map(curPhone => curPhone.subscriberNumber)
    let finalSubscriber;
    allSubscriberNumbers.forEach(sub => {
      if (phone.startsWith(sub)) {
        finalSubscriber = sub;
      }
    });

    let finalPhoneData;

    try {
      allPhoneDataJson.forEach(p => {
        if (finalSubscriber == p.subscriberNumber) {
          finalPhoneData = p;
        }
      });
      if (!finalPhoneData) {
        const error = new Error('This Number Doesnt Match to an Existing MNO');
        error.name = 'WRONG_NUMBER';
        throw error;
      }
    } catch (err) {
      return next(err)
    }

    console.log(finalPhoneData)
    res.json(finalPhoneData)
  })

module.exports = phoneRouter