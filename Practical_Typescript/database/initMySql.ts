import con from "./dbConfig";
import { allApiKeys, allMSISDN } from "./data";

function databaseInit() {
  con.connect(function (err: Error) {
    if (err) throw err;
    console.log("Connected!");
  });

  con.query("DROP DATABASE IF EXISTS myfracdb", function (err: Error) {
    if (err) throw err;
    console.log("Database created");
  });

  con.query("CREATE DATABASE IF NOT EXISTS myfracdb", function (err: Error) {
    if (err) throw err;
    console.log("Database created");
  });

  let sql =
    "CREATE TABLE myfracdb.apikey (id INT AUTO_INCREMENT PRIMARY KEY, apiKey VARCHAR(255))";
  con.query(sql, function (err: Error) {
    if (err) throw err;
    console.log("Table created");
  });

  sql =
    "CREATE TABLE myfracdb.apikeyhistory (id INT AUTO_INCREMENT, apiId INT, weight INT, time BIGINT, PRIMARY KEY(id), FOREIGN KEY(apiId) REFERENCES myfracdb.apikey(id))";

  con.query(sql, function (err: Error) {
    if (err) throw err;
    console.log("Table created");
  });

  allApiKeys.forEach((apiElement) => {
    const sql = `INSERT INTO myfracdb.apikey (apiKey) VALUES ('${apiElement.apiKey}')`;
    con.query(sql, function (err: Error) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });

  sql =
    "CREATE TABLE myfracdb.msisdn (id INT AUTO_INCREMENT PRIMARY KEY, mno VARCHAR(255), countryCode VARCHAR(255), subscriberNumber  VARCHAR(255), country VARCHAR(255))";
  con.query(sql, function (err: Error) {
    if (err) throw err;
    console.log("Table created");
  });

  allMSISDN.forEach((msisdnElement) => {
    const sql = `INSERT INTO myfracdb.msisdn (mno, countryCode, subscriberNumber, country) VALUES
     ('${msisdnElement.mno}', '${msisdnElement.countryCode}', '${msisdnElement.subscriberNumber}','${msisdnElement.country}')`;
    con.query(sql, function (err: Error) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });

  //con.end();
}

export default databaseInit;
