const { mysqlConfig } = require('../utils/config');
var mysql = require('mysql');
var con = mysql.createConnection(mysqlConfig);

module.exports = {
    con
}