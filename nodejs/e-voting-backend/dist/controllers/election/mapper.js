"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toElection = void 0;
const toElection = (election) => {
    return {
        id: election.id,
        name: election.name,
        description: election.description,
        startTime: election.startTime,
        endTime: election.endTime,
        status: election.status,
        createdAt: election.createdAt,
        updatedAt: election.updatedAt,
        deletedAt: election.deletedAt,
    };
};
exports.toElection = toElection;
//# sourceMappingURL=mapper.js.map