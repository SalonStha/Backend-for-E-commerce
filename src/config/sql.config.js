const { Sequelize } = require('sequelize');
const { SQLConfig } = require('./config');

const sequelize = new Sequelize(SQLConfig.database, SQLConfig.user, SQLConfig.password, {
    host: SQLConfig.host,
    dialect: SQLConfig.dialect,
    port: SQLConfig.port,
    logging: false, 
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully');
    } catch (error) {
        console.error('PostgreSQL connection failed:', error);
    }
}

module.exports = { 
    sequelize, 
    testConnection 
};
