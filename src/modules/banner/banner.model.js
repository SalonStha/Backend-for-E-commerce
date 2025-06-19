const { sequelize } = require('../../config/sql.config');
const { Status } = require("../../config/constants");
const DataTypes = require('sequelize'); //Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.
const UserModel = require('../user/user.model');

const BannerModel = sequelize.define('Banners', {
    _id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true, 
        unique: true,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status : {
        type: DataTypes.ENUM(Object.values(Status)),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
      },
})

module.exports = BannerModel;   
