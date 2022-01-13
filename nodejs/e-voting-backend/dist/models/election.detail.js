"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
const candidate_1 = __importDefault(require("./candidate"));
const party_1 = __importDefault(require("./party"));
class ElectionDetail extends sequelize_1.Model {
}
ElectionDetail.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    electionId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'elections', key: 'id' },
        field: 'election_id'
    },
    partyId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'parties', key: 'id' },
        field: 'parties_id'
    },
    candidateId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'candidates', key: 'id' },
        field: 'candidate_id'
    },
    position: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    sequelize: sequelize_2.sequelize,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'election_details'
});
ElectionDetail.belongsTo(party_1.default, { foreignKey: 'partyId' });
ElectionDetail.belongsTo(candidate_1.default, { foreignKey: 'candidateId' });
exports.default = ElectionDetail;
//# sourceMappingURL=election.detail.js.map