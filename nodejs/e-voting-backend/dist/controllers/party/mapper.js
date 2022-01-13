"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toParty = void 0;
const toParty = (party) => {
    return {
        id: party.id,
        name: party.name,
        status: party.status,
        createdAt: party.createdAt,
        updatedAt: party.updatedAt,
        deletedAt: party.deletedAt,
    };
};
exports.toParty = toParty;
//# sourceMappingURL=mapper.js.map