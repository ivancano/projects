"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parties_1 = __importDefault(require("./parties"));
const candidates_1 = __importDefault(require("./candidates"));
const voters_1 = __importDefault(require("./voters"));
const election_details_1 = __importDefault(require("./election.details"));
const elections_1 = __importDefault(require("./elections"));
const election_voters_1 = __importDefault(require("./election.voters"));
const router = (0, express_1.Router)();
router.use('/parties', parties_1.default);
router.use('/candidates', candidates_1.default);
router.use('/voters', voters_1.default);
router.use('/elections', elections_1.default);
router.use('/election-details', election_details_1.default);
router.use('/election-voters', election_voters_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map