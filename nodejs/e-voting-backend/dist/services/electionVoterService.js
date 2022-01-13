"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.deleteById = exports.getById = exports.update = exports.create = void 0;
const sequelize_1 = require("sequelize");
const election_voter_1 = __importDefault(require("../models/election.voter"));
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const election = yield election_voter_1.default.create(payload);
        return election;
    }
    catch (e) {
        throw new Error("Se produjo un error al crear la elección");
    }
});
exports.create = create;
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const election = yield election_voter_1.default.findByPk(id);
        if (!election) {
            throw new Error();
        }
        const updatedElection = yield election.update(payload);
        return updatedElection;
    }
    catch (e) {
        throw new Error("Se produjo un error al editar la elección");
    }
});
exports.update = update;
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const election = yield election_voter_1.default.findByPk(id);
        if (!election) {
            throw new Error();
        }
        return election;
    }
    catch (e) {
        throw new Error("Se produjo un error al obtener la elección");
    }
});
exports.getById = getById;
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedElectionCount = yield election_voter_1.default.destroy({
            where: { id }
        });
        return !!deletedElectionCount;
    }
    catch (e) {
        throw new Error("Se produjo un error al eliminar la elección");
    }
});
exports.deleteById = deleteById;
const getAll = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return election_voter_1.default.findAll(Object.assign({ where: Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.isDeleted) && { deletedAt: { [sequelize_1.Op.not]: null } })) }, (((filters === null || filters === void 0 ? void 0 : filters.isDeleted) || (filters === null || filters === void 0 ? void 0 : filters.includeDeleted)) && { paranoid: true })));
    }
    catch (e) {
        throw new Error("Se produjo un error al obtener las elecciones");
    }
});
exports.getAll = getAll;
//# sourceMappingURL=electionVoterService.js.map