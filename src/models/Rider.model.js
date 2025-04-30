'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RiderRequest extends Model {
        static associate(models) {

        }
    }
    RiderRequest.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        rider_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        pickup_lat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        pickup_lng: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        drop_lat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        drop_lng: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'matched', 'cancelled'),
            defaultValue: 'pending',
        }
    }, {
        sequelize,
        modelName: 'RiderRequest',
        tableName: 'rider_requests',
        underscored: true,   // for snake_case fields
        timestamps: true,    // manages createdAt, updatedAt automatically
    });

    return RiderRequest;
}
