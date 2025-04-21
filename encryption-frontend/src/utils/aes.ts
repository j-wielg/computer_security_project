


/**
 * Encrypts a single block using the AES encryption algorithm.
 * Bitstrings are encoded in such a way that the most-significant bit represents
 * the first bit.
 *
 * @param block - A 128-bit integer representing the block to encrypt
 *
 * @returns A 128-bit number whose bits are the encrypted block
 */
function aesBlockEncrypt(block: number) : number {
    return 1
}


/**
 * Encrypts a sequence of bits using the AES encryption algorithm
 *
 * @param blocks - A sequence of blocks to encrypt
 * @param mode - What block-chaining mode to use. Posssible values are:
 * 0 - Electronic code book
 * 1 - Chained blocks
 * 2 - Counter
 * @param iv - If using chained blocks, this specifies the initialization vector
 */
export function aesEncrypt(blocks: number[], mode: number, iv: number) : Array<number> {
    return []
}
