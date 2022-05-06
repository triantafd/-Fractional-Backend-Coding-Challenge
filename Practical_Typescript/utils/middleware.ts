import logger from "./logger";
import con from "../database/dbConfig";
import config from "./config";
import { ErrorRequestHandler, NextFunction, Response, Request } from "express";
import { CustonRateLimitRequest, LoggerRequest } from "../types";
import util from "util";

const requestLogger = (
  req: LoggerRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");

  next();
};

const customRateLimiter = async (
  req: CustonRateLimitRequest,
  res: Response,
  next: NextFunction
) => {
  const curDate = Date.now();
  const windowDate = curDate - config.windowMs;
  let api_key = "";

  try {
    api_key = req.query.api_key;
    if (!api_key) {
      const error = new Error("The parameter to query the key is api_key");
      error.name = "WRONG_QUERY";
      throw error;
    }
  } catch (err) {
    return next(err);
  }

  const query = util.promisify(con.query).bind(con);
  let sql = `SELECT id FROM myfracdb.apikey WHERE apiKey='${api_key}'`;
  let apiId;

  try {
    const result = await query(sql);
    if (result instanceof Array) {
      if (!result[0]) {
        const error = new Error("Api Key Doesnt Exist");
        error.name = "WRONG_API_KEY";
        throw error;
      }
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access
      apiId = JSON.parse(JSON.stringify(result[0])).id as number;
    }
  } catch (err) {
    return next(err);
  }

  sql = `SELECT SUM(weight) AS totalWeight  FROM myfracdb.apikeyhistory WHERE apiId=${apiId} AND time>${windowDate}`;
  let apiUsage: number;
  try {
    const res = await query(sql);
    if (res instanceof Array) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access
      apiUsage = JSON.parse(JSON.stringify(res[0])).totalWeight as number;
      if (apiUsage >= config.maxUsage) {
        const error = new Error("API KEY MAX USAGE");
        error.name = "API_KEY_MAX_USAGE";
        throw error;
      }
    }
  } catch (err) {
    next(err);
  }

  try {
    sql = `INSERT INTO myfracdb.apikeyhistory(apiId, weight, time) VALUES (${apiId}, 1, ${curDate})`;
    await query(sql);
  } catch (err) {
    next(err);
  }

  next();
};

/* interface IUnkownEndpointResponse extends Response {
  error?: (code: number, message: string) => Response;
  success?: (code: number, message: string, result: any) => Response; 
} */

const unknownEndpoint = (req: Request, res: Response) => {
  return res.status(404).send({
    error: "unknown endpoint",
  });
};

const errorHandler: ErrorRequestHandler = (error: Error, req, res, next) => {
  logger.error(error.name);

  if (error.name === "WRONG_API_KEY") {
    return res.status(400).send({
      error: "Api_key error, you are using a wrong api key",
    });
  } else if (error.name === "WRONG_NUMBER") {
    return res.status(400).send({
      error: "WRONG_NUMBER error, you are using a number that doesnt exist",
    });
  } else if (error.name === "WRONG_QUERY") {
    return res.status(400).send({
      error:
        "WRONG_QUERY error, you are using a wrong query parameter for api key",
    });
  } else if (error.name === "WRONG_INPUT") {
    return res.status(400).send({
      error: "WRONG_INPUT error, the input is not a telephone number",
    });
  } else if (error.name === "API_KEY_MAX_USAGE") {
    return res.status(429).send({
      error: "API_KEY_MAX_USAGE, slow down your requests",
    });
  }

  return next(error);
};

export default {
  customRateLimiter,
  errorHandler,
  unknownEndpoint,
  requestLogger,
};
