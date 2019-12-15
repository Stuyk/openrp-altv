const curve = [];
let points = 0;
let xp = 0;
let minLevel = 2;
let maxLevel = 99;

for (let lvl = 1; lvl <= maxLevel; lvl++) {
    points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7));
    if (lvl >= minLevel) curve.push({ lvl, xp });
    xp = Math.floor(points / 4);
}

export function getLevel(passedXP) {
    const xp = parseInt(passedXP) * 1;
    let closest = curve.findIndex(x => x.xp >= xp);

    if (xp > 13034431) {
        return maxLevel;
    }

    if (curve[closest].xp > xp) {
        let result = curve[closest - 1];
        if (!result) return 1;
        return result.lvl;
    }
    return curve[closest].lvl;
}

export function getXP(lvl) {
    if (lvl >= 99) return 13034431;
    return curve.find(x => x.lvl >= lvl).xp;
}
