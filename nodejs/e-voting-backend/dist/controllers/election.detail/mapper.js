"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toElectionDetail = void 0;
const toElectionDetail = (electionDetail) => {
    return {
        id: electionDetail.id,
        electionId: electionDetail.electionId,
        partyId: electionDetail.partyId,
        party: electionDetail.Party,
        candidateId: electionDetail.candidateId,
        candidate: electionDetail.Candidate,
        position: electionDetail.position,
        createdAt: electionDetail.createdAt,
        updatedAt: electionDetail.updatedAt,
        deletedAt: electionDetail.deletedAt,
    };
};
exports.toElectionDetail = toElectionDetail;
//# sourceMappingURL=mapper.js.map