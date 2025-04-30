const IP: number[] = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
]
const IP_inv: number[] = [
    40 ,8 ,48 ,16 ,56 ,24 ,64 ,32,
    39 ,7 ,47 ,15 ,55 ,23 ,63 ,31,
    38 ,6 ,46 ,14 ,54 ,22 ,62 ,30,
    37 ,5 ,45 ,13 ,53 ,21 ,61 ,29,
    36 ,4 ,44 ,12 ,52 ,20 ,60 ,28,
    35 ,3 ,43 ,11 ,51 ,19 ,59 ,27,
    34 ,2 ,42 ,10 ,50 ,18 ,58 ,26,
    33 ,1 ,41 ,9 ,49 ,17 ,57 ,25,
]
const E_bit: number[] = [
    32 ,1 ,2 ,3 ,4 ,5,
    4 ,5 ,6 ,7 ,8 ,9,
    8 ,9 ,10 ,11 ,12 ,13,
    12 ,13 ,14 ,15 ,16 ,17,
    16 ,17 ,18 ,19 ,20 ,21,
    20 ,21 ,22 ,23 ,24 ,25,
    24 ,25 ,26 ,27 ,28 ,29,
    28 ,29 ,30 ,31 ,32 ,1 ,
]
const P: number[] = [
    16 ,7 ,20 ,21 ,29 ,12 ,28 ,17,
    1 ,15 ,23 ,26 ,5 ,18 ,31 ,10,
    2 ,8 ,24 ,14 ,32 ,27 ,3 ,9,
    19 ,13 ,30 ,6 ,22 ,11 ,4 ,25,
]
const PC1: number[] = [
    57 ,49 ,41 ,33 ,25 ,17 ,9,
    1 ,58 ,50 ,42 ,34 ,26 ,18,
    10 ,2 ,59 ,51 ,43 ,35 ,27,
    19 ,11 ,3 ,60 ,52 ,44 ,36,
    63 ,55 ,47 ,39 ,31 ,23 ,15,
    7 ,62 ,54 ,46 ,38 ,30 ,22,
    14 ,6 ,61 ,53 ,45 ,37 ,29,
    21 ,13 ,5 ,28 ,20 ,12 ,4,
]
const PC2: number[] = [
    14, 17, 11, 24, 1,  5,
    3,  28, 15, 6,  21, 10,
    23, 19, 12, 4,  26, 8,
    16, 7,  27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
]
const ITABLE: number[] = [
    1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1
]
const S_Boxes: number[] = [
    14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
    0,  15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
    4,   1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
    15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13,
    15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
    3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
    0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
    13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9,
    10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
    13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
    13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
    1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12,
    7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
    13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
    10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
    3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14,
    2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
    14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
    4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
    11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3,
    12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
    10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
    9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
    4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13,
    4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
    13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
    1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
    6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12,
    13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
    1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
    7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
    2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11,
]


function print_bin(num: bigint, size: number, groupSize: number) {
    let s: string = num.toString(2).padStart(size, "0");
    let out: string = ""
    for (let i=0; i < Math.floor(size / groupSize); ++i) {
        out += s.slice(groupSize*i, groupSize*(i+1));
        out += " ";
    }
    return out;
}

/**
  * Function which permutes a binary number's bits using a list.
  * Assumes that the permutation list is 1-indexed, 
  * with 1 being the most-significant bit
  *
  * @param permutation - The list of integers representing the permutation
  * @param value - The value whose bits should be permuted
  * @param size - The number of valid bits in the input
  */
function permute(permutation: number[], value: bigint, size: number): bigint {
    let result = BigInt(0);
    let i = BigInt(permutation.length - 1);
    for (let index of permutation) {
    let temp: bigint = value & (BigInt(1) << BigInt(size - index));
        temp >>= BigInt(size - index);
        temp <<= i;
        --i;
        result |= temp;
    }
    return result;
}

/**
 * Function which applies a round left-shift on a value
 */
function lshift(value: bigint, amount: number, size: number): bigint {
    value <<= BigInt(amount);
    for (let i=0; i < amount; ++i) {
        let temp: bigint = value & (BigInt(1) << BigInt(size + i));
        value ^= temp;
        temp >>= BigInt(size);
        value |= temp;
    }
    return value;
}

/**
 * Function which generates the round keys according to the DES key schedule.
 */
function desKeygen(key: bigint): bigint[] {
    let keys: bigint[] = [];
    let key_prime: bigint = permute(PC1, key, 64);
    let mask: bigint = BigInt(0xFFFFFFF);
    let C: bigint = (key_prime & (mask << BigInt(28))) >> BigInt(28);
    let D: bigint = key_prime & mask;
    for (let i=0; i < 16; ++i) {
        C = lshift(C, ITABLE[i], 28);
        D = lshift(D, ITABLE[i], 28);
        let temp = (C << BigInt(28)) | D;
        temp = permute(PC2, temp, 56);
        keys.push(temp);
    }
    return keys;
}

/**
 * Function which retrieves a value from SBOX_i given a row and column.
 */
function getSBox(i: number, row: number, col: number): number {
    let index = 64 * i;
    return S_Boxes[index + (row * 16) + col];
}

/**
 * The Feistel function in the DES algorithm
 *
 * @param R - A 32-bit intermediate in the DES algorithm
 * @param key - A 48-bit round key
 */
function F(R: bigint, key: bigint): bigint {
    R = permute(E_bit, R, 32);
    R = R ^ key;
    let output: bigint = BigInt(0);
    let shift = BigInt(0);
    for (let i=0; i < 8; ++i) {
        let group = Number(R & BigInt(0b111111));
        R >>= BigInt(6);
        let row = ((group >> 4) & 2) | (group & 1);
        let col = (group & 0b011110) >> 1;
        output |= (BigInt(getSBox(7 - i, row, col)) << shift);
        shift += BigInt(4);
    }
    output = permute(P, output, 32);
    return output;
}

/**
 * Encrypts a single block of data using the DES algorithm.
 *
 * @param block - A 64-bit block of data
 * @param round_keys - A list of 48-bit round keys.
 */
function desBlockEncrypt(block: bigint, round_keys: bigint[]): bigint {
    block = permute(IP, block, 64);
    let mask = BigInt(0xFFFFFFFF);
    let L = (block & (mask << BigInt(32))) >> BigInt(32);
    let R = block & mask;
    for (let i=0; i < 16; ++i) {
        let temp = R;
        R = L ^ F(R, round_keys[i]);
        L = temp;
    }
    let output = (R << BigInt(32)) | L;
    return permute(IP_inv, output, 64);
}

/**
 * Decrypts a single block of data using the DES algorithm.
 *
 * @param block - A 64-bit block of encrypted data
 * @param round_keys - A list containing 16 48-bit round keys
 */
function desBlockDecrypt(block: bigint, round_keys: bigint[]) : bigint {
    block = permute(IP, block, 64);
    let mask = BigInt(0xFFFFFFFF);
    let L = (block & (mask << BigInt(32))) >> BigInt(32);
    let R = block & mask;
    for (let i=0; i < 16; ++i) {
        let temp = R;
        R = L ^ F(R, round_keys[15 - i]);
        L = temp;
    }
    let output = (R << BigInt(32)) | L;
    return permute(IP_inv, output, 64);
}

/**
 * Encrypts a series of bytes by applying the DES algorithm 3 times
 *
 * @param bytes - An array of bytes which represents the data to encrypt.
 * @param key1 - A 64-bit key
 * @param key2 - A 64-bit key
 * @param key3 - A 64-bit key
 * @param mode - The block mode to encrypt with. Allowed values are:
 * 0. Electronic Codebook (EBC)
 * 1. Cipherblock Chain (CBC)
 * 2. Counter (CTR)
 * @param iv - The initialization vector for CBC and nonce for CTR
 */
export function tdesEncrypt(
    bytes: number[], 
    key1: bigint,
    key2: bigint,
    key3: bigint,
    mode: number,
    iv: bigint = BigInt(0)
) {
    // Generates the round keys
    let rkeys_1 = desKeygen(key1);
    let rkeys_2 = desKeygen(key2);
    let rkeys_3 = desKeygen(key3);
    // Adds a sentinel to the end of the data
    bytes.push(0xFF);
    bytes.push(0x00);
    while (bytes.length % 8 != 0) {
        bytes.push(0x00);
    }
    let block: bigint = BigInt(0);
    let prev: bigint = iv;
    if (mode == 2) {
        let mask = BigInt(0xFF_FF_FF_FF_FF_FF);
        iv &= mask;
        iv <<= BigInt(16);
    }
    // Encrypts the data in blocks
    for (let i=0; i < bytes.length / 8; ++i) {
        for (let k=0; k < 8; ++k) {
            block <<= BigInt(8);
            block |= BigInt(bytes[(8*i) + k]);
        }
        if (mode == 0) {
            block = desBlockEncrypt(block, rkeys_1);
            block = desBlockEncrypt(block, rkeys_2);
            block = desBlockEncrypt(block, rkeys_3);
        } else if (mode == 1) {
            block ^= prev;
            block = desBlockEncrypt(block, rkeys_1);
            block = desBlockEncrypt(block, rkeys_2);
            block = desBlockEncrypt(block, rkeys_3);
            prev = block;
        } else if (mode == 2) {
            let temp = iv;
            temp = desBlockEncrypt(temp, rkeys_1);
            temp = desBlockEncrypt(temp, rkeys_2);
            temp = desBlockEncrypt(temp, rkeys_3);
            block ^= temp;
            ++iv;
        }
        let mask = BigInt(0xFF) << BigInt(7*8);
        let shift = 7*8;
        for (let k=0; k < 8; ++k) {
            let byte = (mask & block) >> BigInt(shift);
            bytes[(8*i) + k] = Number(byte);
            mask >>= BigInt(8);
            shift -= 8;
        }
        block = BigInt(0);
    }
}


/**
 * Decrypts an array of DES-encrypted blocks.
 *
 * @param bytes- An array of encrypted bytes
 * @param key1 - A 64-bit key
 * @param key2 - A 64-bit key
 * @param key3 - A 64-bit key
 * @param mode - The block mode used to encrypt the data.
 * 0. Electronic Codebook (EBC)
 * 1. Cipherblock Chain (CBC)
 * 2. Counter (CTR)
 * @param iv - The initialization vector for CBC and nonce for CTR
 *
 * @returns Whether the decryption was successful
 */
export function tdesDecrypt(
    bytes: number[], 
    key1: bigint,
    key2: bigint,
    key3: bigint,
    mode: number,
    iv: bigint = BigInt(0)
): boolean {
    // Generates the round keys
    let rkeys_1 = desKeygen(key1);
    let rkeys_2 = desKeygen(key2);
    let rkeys_3 = desKeygen(key3);
    if (bytes.length  % 8 != 0) {
        return false;
    }
    let prev: bigint = iv;
    let temp = BigInt(0);
    if (mode == 2) {
        let mask = BigInt(0xFF_FF_FF_FF_FF_FF);
        iv &= mask;
        iv <<= BigInt(16);
    }
    for (let i=0; i < bytes.length / 8; ++i) {
        let block = BigInt(0);
        for (let k=0; k < 8; ++k) {
            block <<= BigInt(8);
            block |= BigInt(bytes[(8*i) + k]);
        }
        if (mode == 0) {
            block = desBlockDecrypt(block, rkeys_3);
            block = desBlockDecrypt(block, rkeys_2);
            block = desBlockDecrypt(block, rkeys_1);
        } else if (mode == 1) {
            temp = block;
            block = desBlockDecrypt(block, rkeys_3);
            block = desBlockDecrypt(block, rkeys_2);
            block = desBlockDecrypt(block, rkeys_1);
            block ^= prev;
            prev = temp;
        } else if (mode == 2) {
            let temp = iv;
            temp = desBlockEncrypt(temp, rkeys_1);
            temp = desBlockEncrypt(temp, rkeys_2);
            temp = desBlockEncrypt(temp, rkeys_3);
            block ^= temp;
            ++iv;
        }
        let mask = BigInt(0xFF) << BigInt(7*8);
        let shift = 7*8;
        for (let k=0; k < 8; ++k) {
            let byte = (mask & block) >> BigInt(shift);
            bytes[(8*i) + k] = Number(byte);
            mask >>= BigInt(8);
            shift -= 8;
        }
    }
    let byte = bytes.pop();
    if (byte != 0x00) {
        return false;
    }
    while (byte == 0x00) {
        byte = bytes.pop();
    }
    if (byte != 0xFF) {
        return false;
    }
    return true;
}
