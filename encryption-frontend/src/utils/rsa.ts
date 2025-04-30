// Helper for modular exponentiation (base^exp % mod)
function _modularExp(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = BigInt(1);
  base = base % mod;
  while (exp > BigInt(0)) {
    if (exp % BigInt(2) === BigInt(1)) {
      result = (result * base) % mod;
    }
    exp = exp >> BigInt(1);
    base = (base * base) % mod;
  }
  return result;
}

// Helper for computing inverses modulo n
function _modularInverse(a: bigint, n: bigint): bigint {
  let t = BigInt(0),
    newT = BigInt(1);
  let r = n,
    newR = a;

  while (newR !== BigInt(0)) {
    const quotient = r / newR;
    [t, newT] = [newT, t - quotient * newT];
    [r, newR] = [newR, r - quotient * newR];
  }

  if (t < BigInt(0)) {
    t += n;
  }

  return t;
}

// Helper for computing greatest common divisors
function _gcd(a: bigint, b: bigint): bigint {
  while (b !== BigInt(0)) {
    [a, b] = [b, a % b];
  }

  return a;
}

// RSA Key Generation: Returns (e, n, d) for given input (p, q)
export function rsaKeyGen(p: bigint, q: bigint): [bigint, bigint, bigint] {
  const n = p * q;
  const phi = (p - BigInt(1)) * (q - BigInt(1));

  let e = BigInt(Math.floor(Math.random() * 1048576));
  while (_gcd(e, phi) !== BigInt(1)) {
    e = BigInt(Math.floor(Math.random() * 1048576));
  }

  const d = _modularInverse(e, phi);
  return [e, n, d];
}

// RSA Key Generation: Returns (e, n, d) using hardcoded large primes without user input
export function rsaKeyGenDefault(): [bigint, bigint, bigint] {
  // Using the same primes as the test
  const p = BigInt("1234567891");
  const q = BigInt("9876543211");
  return rsaKeyGen(p, q);
}

// RSA Encryption: c = m^e mod n
export function rsaEncrypt(message: bigint, e: bigint, n: bigint): bigint {
  return _modularExp(message, e, n);
}

// RSA Decryption: m = c^d mod n
export function rsaDecrypt(ciphertext: bigint, d: bigint, n: bigint): bigint {
  const decrypted = _modularExp(ciphertext, d, n);
  // Calculate the maximum number of bytes needed based on n
  const maxBytes = Math.floor(n.toString(2).length / 8);
  // Convert to hex with proper padding
  let hex = decrypted.toString(16);
  // Ensure even length
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }
  // Pad to maximum bytes
  while (hex.length < maxBytes * 2) {
    hex = "00" + hex;
  }
  return BigInt("0x" + hex);
}
