import config from '../utils/config';
import mysql from 'mysql';
const con = mysql.createConnection(config.mysqlConfig);

export default con;