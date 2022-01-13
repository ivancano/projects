"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
const party_1 = __importDefault(require("./party"));
class Candidate extends sequelize_1.Model {
}
Candidate.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    partyId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'parties', key: 'id' },
        field: 'parties_id'
    }
}, {
    timestamps: true,
    sequelize: sequelize_2.sequelize,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'candidates'
});
Candidate.belongsTo(party_1.default, { foreignKey: 'partyId' });
exports.default = Candidate;
//# sourceMappingURL=candidate.js.map