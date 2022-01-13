"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Election extends sequelize_1.Model {
}
Election.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'start_time'
    },
    endTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'end_time'
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: true,
    sequelize: sequelize_2.sequelize,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'elections'
});
exports.default = Election;
//# sourceMappingURL=election.js.map