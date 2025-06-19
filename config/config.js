const { SQLConfig } = require('../src/config/config');
module.exports = {
  development: {
    "username": SQLConfig.user,
    "password": SQLConfig.password,
    "database": SQLConfig.database,
    "host": SQLConfig.host,
    "dialect": `${SQLConfig.dialect}`,
  },
  test: {
    "username": SQLConfig.user,
    "password": SQLConfig.password,
    "database": SQLConfig.database,
    "host": SQLConfig.host,
    "dialect": `${SQLConfig.dialect}`,
  },
  production: {
    "username": SQLConfig.user,
    "password": SQLConfig.password,
    "database": SQLConfig.database,
    "host": SQLConfig.host,
    "dialect": `${SQLConfig.dialect}`,
  }
}
