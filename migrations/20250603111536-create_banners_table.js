'use strict';
const { Status } = require('../src/config/constants')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Banners', {
      _id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true, 
        unique: true,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      status : {
        type: Sequelize.ENUM(Object.values(Status)),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now() 
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Banners'); // Drop the Banner table
  }
};
