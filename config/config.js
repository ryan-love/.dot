const fs = require('fs');
require("dotenv").config()


module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DEVELOPMENT_NAME,
    "host": process.env.DB_URL,
    "port":process.env.DB_PORT ,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_TEST_NAME,
    "host": process.env.DB_URL,
    "port": process.env.DB_PORT ,
    "dialect": process.env.DB_TYPE
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_PRODUCTION_NAME,
    "host": process.env.DB_URL,
    "port": process.env.DB_PORT ,
    "dialect": process.env.DB_TYPE
  }
};
