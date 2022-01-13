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
exports.getByDNI = exports.getAll = exports.deleteById = exports.getById = exports.update = exports.create = void 0;
const sequelize_1 = require("sequelize");
const voter_1 = __importDefault(require("../models/voter"));
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const voter = yield voter_1.default.create(payload);
        return voter;
    }
    catch (e) {
        throw new Error("Se produjo un error al crear el votante");
    }
});
exports.create = create;
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const voter = yield voter_1.default.findByPk(id);
        if (!voter) {
            throw new Error();
        }
        const updatedVoter = yield voter.update(payload);
        return updatedVoter;
    }
    catch (e) {
        throw new Error("Se produjo un error al editar el votante");
    }
});
exports.update = update;
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const voter = yield voter_1.default.findByPk(id);
        if (!voter) {
            throw new Error();
        }
        return voter;
    }
    catch (e) {
        throw new Error("Se produjo un error al obtener el votante");
    }
});
exports.getById = getById;
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedVoterCount = yield voter_1.default.destroy({
            where: { id }
        });
        return !!deletedVoterCount;
    }
    catch (e) {
        throw new Error("Se produjo un error al eliminar el votante");
    }
});
exports.deleteById = deleteById;
const getAll = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return voter_1.default.findAll(Object.assign({ where: Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.isDeleted) && { deletedAt: { [sequelize_1.Op.not]: null } })) }, (((filters === null || filters === void 0 ? void 0 : filters.isDeleted) || (filters === null || filters === void 0 ? void 0 : filters.includeDeleted)) && { paranoid: true })));
    }
    catch (e) {
        throw new Error("Se produjo un error al obtener los votantes");
    }
});
exports.getAll = getAll;
const getByDNI = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return voter_1.default.findAll(Object.assign({ where: Object.assign(Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.isDeleted) && { deletedAt: { [sequelize_1.Op.not]: null } })), ((filters === null || filters === void 0 ? void 0 : filters.dni) && { dni: filters === null || filters === void 0 ? void 0 : filters.dni })) }, (((filters === null || filters === void 0 ? void 0 : filters.isDeleted) || (filters === null || filters === void 0 ? void 0 : filters.includeDeleted)) && { paranoid: true })));
    }
    catch (e) {
        throw new Error("Se produjo un error al obtener los votantes");
    }
});
exports.getByDNI = getByDNI;
//# sourceMappingURL=voterService.js.map