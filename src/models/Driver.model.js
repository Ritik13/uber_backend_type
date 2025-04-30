const { Model } = require("sequelize");


module.exports =(sequelize , DataTypes) => {
    class DriverRequest extends Model {
        static associate(models) {

        }
    }

    DriverRequest.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          current_lat: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          current_lng: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          status: {
            type: DataTypes.ENUM('available', 'unavailable', 'on_trip'),
            allowNull: false,
            defaultValue: 'unavailable'
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          }
    } , {
        sequelize,
        modelName: "Driver",
        tableName: "drivers",
        underscored: true,
        timestamps: true
    })

    return DriverRequest
}
