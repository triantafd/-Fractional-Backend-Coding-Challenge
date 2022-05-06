const { con } = require('./dbConfig')
const { allApiKeys, allMSISDN } = require('./data')

function databaseInit() {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  con.query("DROP DATABASE IF EXISTS myfracdb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  con.query("CREATE DATABASE IF NOT EXISTS myfracdb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  var sql = "CREATE TABLE myfracdb.apikey (id INT AUTO_INCREMENT PRIMARY KEY, api_key VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  var sql = "CREATE TABLE myfracdb.apikeyhistory (id INT AUTO_INCREMENT, api_id INT, weight INT, time BIGINT, PRIMARY KEY(id), FOREIGN KEY(api_id) REFERENCES myfracdb.apikey(id))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  allApiKeys.forEach(apiElement => {
    let sql = `INSERT INTO myfracdb.apikey (api_key) VALUES ('${apiElement.apiKey}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  })

  var sql = "CREATE TABLE myfracdb.msisdn (id INT AUTO_INCREMENT PRIMARY KEY, mno VARCHAR(255), countryCode VARCHAR(255), subscriberNumber  VARCHAR(255), country VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  allMSISDN.forEach(msisdnElement => {
    let sql = `INSERT INTO myfracdb.msisdn (mno, countryCode, subscriberNumber, country) VALUES
     ('${msisdnElement.mno}', '${msisdnElement.countryCode}', '${msisdnElement.subscriberNumber}','${msisdnElement.country}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  })

  //con.end();
}

module.exports = {
  databaseInit
}