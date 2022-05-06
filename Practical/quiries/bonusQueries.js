const { con } = require('../database/dbConfig')
const util = require('util');

const query = util.promisify(con.query).bind(con);

const sumRequestsPerTimeframe = async (dateFrom, dateTo) => {
  const dateFromMs = new Date(dateFrom).getTime();
  const dateToMs = new Date(dateTo).getTime();

  const sql = `SELECT SUM(weight) AS SumWeight 
  FROM myfracdb.apikeyhistory 
  WHERE time>${dateFromMs} AND time<${dateToMs}`;

  const queryResult = await query(sql);
  let sumRequests;
  if (queryResult instanceof Array) {
    sumRequests = JSON.parse(JSON.stringify(queryResult[0]))
    return sumRequests;
  } else {
    throw new Error("Error");
  }
};

const avgRequestsPerTimeframe = async (dateFrom, dateTo) => {
  const dateFromMs = new Date(dateFrom).getTime();
  const dateToMs = new Date(dateTo).getTime();
  const sql = `SELECT AVG(WeightPerId) FROM
    (
    SELECT COUNT(weight) as WeightPerId
    FROM myfracdb.apikeyhistory 
    WHERE time>${dateFromMs} AND time<${dateToMs}
    GROUP BY apiId
    )	 as WeightPerId`;

  const queryResult = await query(sql);
  let avgRequests;

  if (queryResult instanceof Array) {
    avgRequests = JSON.parse(JSON.stringify(queryResult[0]));
    return avgRequests;
  } else {
    throw new Error("Error");
  }
};

const mostUsedApiKey = async () => {
  const sql = `SELECT MAX(WeightPerId) as maxWeight,  apiKey 
    FROM 
    ( SELECT COUNT(weight) as weightPerId, apiId 
    FROM myfracdb.apikeyhistory  
    GROUP BY apiId  
    )  as WeightPerId  
    INNER JOIN myfracdb.apikey  ON myfracdb.apikey.id=weightPerId.apiId`;

  const queryResult = await query(sql);
  let finalResult;
  if (queryResult instanceof Array) {
    finalResult = JSON.parse(
      JSON.stringify(queryResult[0])
    );
    return finalResult;
  } else {
    throw new Error("Error");
  }
};

mostUsedApiKey()
  .then((res) => console.log(res))
  .catch((err) => {
    throw err;
  });
avgRequestsPerTimeframe("2022-05-06 12:00:00", "2022-07-06 19:00:00")
  .then((res) => console.log(res))
  .catch((err) => {
    throw err;
  });
sumRequestsPerTimeframe("2022-05-06 12:00:00", "2022-07-06 19:00:00")
  .then((res) => console.log(res))
  .catch((err) => {
    throw err;
  });

con.end();

module.exports = {
  avgRequestsPerTimeframe,
  sumRequestsPerTimeframe,
  mostUsedApiKey
}