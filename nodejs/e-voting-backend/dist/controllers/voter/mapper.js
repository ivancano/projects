"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toVoter = void 0;
const toVoter = (voter) => {
    return {
        id: voter.id,
        name: voter.name,
        lastname: voter.lastname,
        dni: voter.dni,
        status: voter.status,
        createdAt: voter.createdAt,
        updatedAt: voter.updatedAt,
        deletedAt: voter.deletedAt,
        pin: voter.pin
    };
};
exports.toVoter = toVoter;
//# sourceMappingURL=mapper.js.map