import * as alt from 'alt';

export const AdminFlags = {
    NONE: 0,
    HELPER: 1,
    MODERATOR: 2,
    ADMIN: 4,
    MAX: 7
};

function isFlagged(flags, flagValue) {
    if ((flags & flagValue) === flagValue) {
        return true;
    }
    return false;
}

export function hasPermission(player, whichRank) {
    return isFlagged(player.rank, whichRank);
}
