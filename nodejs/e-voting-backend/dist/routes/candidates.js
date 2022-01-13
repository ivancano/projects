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
const express_1 = require("express");
const candidateController = __importStar(require("../controllers/candidate"));
const candidatesRouter = (0, express_1.Router)();
candidatesRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const results = yield candidateController.getAll(filters);
        return res.status(200).send(results);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
}));
candidatesRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield candidateController.getById(id);
        return res.status(200).send(result);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
}));
candidatesRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const payload = req.body;
        const result = yield candidateController.update(id, payload);
        return res.status(201).send(result);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
}));
candidatesRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield candidateController.deleteById(id);
        return res.status(204).send({
            success: result
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
}));
candidatesRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const result = yield candidateController.create(payload);
        return res.status(200).send(result);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
}));
exports.default = candidatesRouter;
//# sourceMappingURL=candidates.js.map