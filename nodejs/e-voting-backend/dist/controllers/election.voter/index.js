"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.getById = exports.getAll = exports.update = exports.create = void 0;
const mapper = __importStar(require("./mapper"));
const service = __importStar(require("../../services/electionVoterService"));
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.create(payload);
        return mapper.toElectionVoter(result);
    }
    catch (e) {
        throw e;
    }
});
exports.create = create;
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.update(id, payload);
        return mapper.toElectionVoter(result);
    }
    catch (e) {
        throw e;
    }
});
exports.update = update;
const getAll = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.getAll(filters);
        return result.map(mapper.toElectionVoter);
    }
    catch (e) {
        throw e;
    }
});
exports.getAll = getAll;
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield service.getById(id);
        return mapper.toElectionVoter(result);
    }
    catch (e) {
        throw e;
    }
});
exports.getById = getById;
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield service.deleteById(id);
        return isDeleted;
    }
    catch (e) {
        throw e;
    }
});
exports.deleteById = deleteById;
//# sourceMappingURL=index.js.map