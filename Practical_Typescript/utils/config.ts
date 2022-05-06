import { mysqlConfigType } from "../types";

const PORT = 3000;
const windowMs = 1 * 60 * 1000; 
const maxUsage = 5;

const mysqlConfig: mysqlConfigType = {
  host: "localhost",
  user: "root",
  password: "rooting",
};

export default {
  PORT,
  mysqlConfig,
  windowMs,
  maxUsage
};
