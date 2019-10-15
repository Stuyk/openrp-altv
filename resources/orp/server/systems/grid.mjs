import * as alt from 'alt';
import { RandomNumberGenerator } from '../utility/encryption.mjs';

// Furthest Y Land Coordinate is +8000
// Lowest Y Land Coordinate is -4000
// Furthest X Land Coordinate is 4000
// Lowest X Land Coordinate is around -4000
// X is North/South
// Y is West/East

const minX = -4000;
const maxX = 4000;
const minY = -4000;
const maxY = 8000;
const rows = 20;
const cols = 13;
const width = 600;
const length = 600;

const sectors = new Map();

let pairs = [];
for (let row = 0; row <= rows; row++) {
    let newRow = row * length - Math.abs(minY);
    pairs[row] = [];
    for (let col = 0; col < cols; col++) {
        let newCol = col * width - Math.abs(minX);
        let pos1 = { x: newCol, y: newRow };
        let pos2 = { x: newCol + width, y: newRow + length };
        pairs[row].push({ pos1, pos2 });
    }
}

pairs.forEach((row, sector) => {
    sectors.set(sector, row);
    row.forEach((column, index) => {
        let colshape = new alt.ColshapeCuboid(
            column.pos1.x,
            column.pos1.y,
            -500,
            column.pos2.x,
            column.pos2.y,
            10000
        );
        colshape.sector = {
            x: index,
            y: sector,
            coords: {
                first: {
                    x: column.pos1.x,
                    y: column.pos1.y,
                    z: -500
                },
                second: {
                    x: column.pos2.x,
                    y: column.pos2.y,
                    z: 10000
                }
            },
            width: width,
            length: length
        };
        colshape.sector.seed = new RandomNumberGenerator(
            JSON.stringify(colshape.sector),
            false
        );
    });
});
