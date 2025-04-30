'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      rider_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      driver_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      pickup_lat: Sequelize.FLOAT,
      pickup_lng: Sequelize.FLOAT,
      drop_lat: Sequelize.FLOAT,
      drop_lng: Sequelize.FLOAT,
      status: {
        type: Sequelize.ENUM('in_progress', 'completed', 'cancelled'),
        defaultValue: 'in_progress',
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Trips');
  }
};
