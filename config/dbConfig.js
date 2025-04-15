const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     logging: false
// });



const sequelize = new Sequelize(
    process.env.SQL_SERVER_DB,
    process.env.SQL_SERVER_USERNAME,
    process.env.SQL_SERVER_PASSWORD,
    {
        host: process.env.SQL_SERVER,
        dialect: 'mssql',
        logging: false,
        dialectOptions: {
            options: {
                encrypt: false, // use false if you're on localhost without encryption
                trustServerCertificate: true, // helpful for local development
                enableArithAbort: true,
                requestTimeout: 30000 // 15 seconds
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    });

module.exports = sequelize;
