import sjcl from 'sjcl';

console.log('Loaded: utility->encryption.mjs');

/**
 * Hash a password with pbkdf2
 * @param password
 */
export function encryptPassword(password) {
    const saltBits = sjcl.random.randomWords(2, 0);
    const salt = sjcl.codec.base64.fromBits(saltBits);

    const key = sjcl.codec.base64.fromBits(
        sjcl.misc.pbkdf2(password, saltBits, 2000, 256)
    );

    return `${key}$${salt}`;
}

// Verify a password matches the pbkdf2
export function verifyPassword(password, storedPasswordHash) {
    const [_key, _salt] = storedPasswordHash.split('$');
    const saltBits = sjcl.codec.base64.toBits(_salt);
    const derivedKey = sjcl.misc.pbkdf2(password, saltBits, 2000, 256);
    const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);

    if (_key != derivedBaseKey) {
        return false;
    }

    return true;
}

/**
 * Generate a hash based on string.
 * @param data
 */
export function generateHash(data) {
    let hashBytes = sjcl.hash.sha256.hash(data + Math.random(0, 900000000));
    return sjcl.codec.hex.fromBits(hashBytes);
}

function xmur3(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)), (h = (h << 13) | (h >>> 19));
    return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

function sfc32(a, b, c, d) {
    return function() {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}

export class RandomNumberGenerator {
    constructor(seed, trueRandom = false) {
        let seedGenerator;
        if (trueRandom) {
            // Will be random every time.
            seedGenerator = xmur3(generateHash(seed));
        } else {
            // Predictable Seed
            seedGenerator = xmur3(seed);
        }
        this.generator = sfc32(
            seedGenerator(),
            seedGenerator(),
            seedGenerator(),
            seedGenerator()
        );
    }

    getNumber(maxSize) {
        return Math.floor(this.generator() * maxSize);
    }
}
