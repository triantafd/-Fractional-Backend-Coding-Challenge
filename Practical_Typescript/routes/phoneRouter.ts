import express from "express";
import bodyParser from "body-parser";
import middleware from "../utils/middleware";
import con from "../database/dbConfig";
import util from "util";
import { PhoneData } from "../types";
import { onlyNumbers } from "../utils/helper";

const phoneRouter = express.Router();
phoneRouter.use(bodyParser.json());

phoneRouter
  .route("/phone/:phoneNumber")
  .get(middleware.customRateLimiter, async (req, res, next) => {
    const query = util.promisify(con.query).bind(con);
    let phone = req.params.phoneNumber;
    let allPhoneData;

    try {
      phone = req.params.phoneNumber;
      if (phone.length < 5 || phone.length > 12 || !onlyNumbers(phone)) {
        const error = new Error("This is not a Number");
        error.name = "WRONG_INPUT";
        throw error;
      }
    } catch (err) {
      return next(err);
    }

    for (let i = 2; i < 4; i++) {
      const sql = `SELECT * FROM myfracdb.msisdn WHERE countryCode='${phone.slice(
        0,
        i
      )}'`;
      try {
        allPhoneData = await query(sql);
      } catch (err) {
        next(err);
      }
      if (allPhoneData instanceof Array) {
        if (allPhoneData[0]) break;
      }
    }

    try {
      if (allPhoneData instanceof Array) {
        if (!allPhoneData[0]) {
          const error = new Error("This Number Doesnt Exist");
          error.name = "WRONG_NUMBER";
          throw error;
        }
      }
    } catch (err) {
      return next(err);
    }

    const allPhoneDataJson = JSON.parse(
      JSON.stringify(allPhoneData)
    ) as Array<PhoneData>;

    const allSubscriberNumbers = allPhoneDataJson.map(
      (curPhone: PhoneData): string => curPhone.subscriberNumber
    );
    let finalSubscriber: string;

    allSubscriberNumbers.forEach((sub: string): void => {
      if (phone.startsWith(sub)) {
        finalSubscriber = sub;
      }
    });

    let finalPhoneData;

    try {
      allPhoneDataJson.forEach((p: PhoneData): void => {
        if (finalSubscriber === p.subscriberNumber) {
          finalPhoneData = p;
        }
      });
      if (!finalPhoneData) {
        const error = new Error("This Number Doesnt Match to an Existing MNO");
        error.name = "WRONG_NUMBER";
        throw error;
      }
    } catch (err) {
      return next(err);
    }

    res.json(finalPhoneData);
  });

export default phoneRouter;
