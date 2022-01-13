"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCandidate = void 0;
const toCandidate = (candidate) => {
    return {
        id: candidate.id,
        name: candidate.name,
        lastname: candidate.lastname,
        partyId: candidate.partyId,
        party: candidate.Party,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
        deletedAt: candidate.deletedAt,
    };
};
exports.toCandidate = toCandidate;
//# sourceMappingURL=mapper.js.map