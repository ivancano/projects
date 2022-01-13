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
const candidate_1 = __importDefault(require("../models/candidate"));
const party_1 = __importDefault(require("../models/party"));
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield candidate_1.default.create(payload);
        return candidate;
    }
    catch (e) {
        throw new Error("Se produjo un error al crear el candidato");
    }
});
exports.create = create;
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield candidate_1.default.findByPk(id);
        if (!candidate) {
            throw new Error();
        }
        const updatedCandidate = yield candidate.update(payload);
        return updatedCandidate;
    }
    catch (e) {
        throw new Error("Se produjo un error al editar el candidato");
    }
});
exports.update = update;
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield candidate_1.default.findByPk(id, {
            include: party_1.default
        });
        if (!candidate) {
            throw new Error();
        }
        return candidate;
    }
    catch (e) {
        throw new Error("Se produjo un error al obtener el candidato");
    }
});
exports.getById = getById;
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCandidateCount = yield candidate_1.default.destroy({
            where: { id }
        });
        return !!deletedCandidateCount;
    }
    catch (e) {
        throw new Error("Se produjo un error al eliminar el candidato");
    }
});
exports.deleteById = deleteById;
const getAll = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return candidate_1.default.findAll(Object.assign(Object.assign({ where: Object.assign(Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.isDeleted) && { deletedAt: { [sequelize_1.Op.not]: null } })), ((filters === null || filters === void 0 ? void 0 : filters.partyId) && { partyId: filters === null || filters === void 0 ? void 0 : filters.partyId })) }, (((filters === null || filters === void 0 ? void 0 : filters.isDeleted) || (filters === null || filters === void 0 ? void 0 : filters.includeDeleted)) && { paranoid: true })), { include: party_1.default }));
    }
    catch (e) {
        throw new Error("Se produjo un error al obtener los candidatos");
    }
});
exports.getAll = getAll;
//# sourceMappingURL=candidateService.js.map