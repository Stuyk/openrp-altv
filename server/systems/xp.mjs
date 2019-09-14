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

export function getLevel(xp) {
    let closest = curve.findIndex(x => x.xp >= xp);
    if (curve[closest].xp > xp) return curve[closest - 1].lvl;
    return curve[closest].lvl;
}

export function getXP(lvl) {
    return curve.find(x => x.lvl >= lvl).xp;
}
