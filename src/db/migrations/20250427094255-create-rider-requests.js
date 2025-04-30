'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('rider_requests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      rider_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      pickup_lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      pickup_lng: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      drop_lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      drop_lng: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'matched', 'cancelled'),
        defaultValue: 'pending',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('rider_requests');
  }
};
