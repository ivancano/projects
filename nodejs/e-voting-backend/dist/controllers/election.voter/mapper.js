"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toElectionVoter = void 0;
const toElectionVoter = (electionVoter) => {
    return {
        id: electionVoter.id,
        electionId: electionVoter.electionId,
        voterId: electionVoter.voterId,
        timestamp: electionVoter.timestamp,
        createdAt: electionVoter.createdAt,
        updatedAt: electionVoter.updatedAt,
        deletedAt: electionVoter.deletedAt,
    };
};
exports.toElectionVoter = toElectionVoter;
//# sourceMappingURL=mapper.js.map