export function vigenereEncrypt(text: string, key: string): string {
  if (!text || !key) return "";

  const result: string[] = [];
  const keyLength = key.length;
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const textChar = text[i];

    if (textChar.match(/[a-zA-Z]/)) {
      const keyChar = key[keyIndex % keyLength].toLowerCase();
      const isUpperCase = textChar === textChar.toUpperCase();
      const textCode = textChar.toLowerCase().charCodeAt(0) - 97;
      const keyCode = keyChar.charCodeAt(0) - 97;

      const encryptedCode = (textCode + keyCode) % 26;
      const encryptedChar = String.fromCharCode(encryptedCode + 97);

      result.push(isUpperCase ? encryptedChar.toUpperCase() : encryptedChar);
      keyIndex++;
    } else {
      result.push(textChar);
    }
  }

  return result.join("");
}

export function vigenereDecrypt(text: string, key: string): string {
  if (!text || !key) return "";

  const result: string[] = [];
  const keyLength = key.length;
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const textChar = text[i];

    if (textChar.match(/[a-zA-Z]/)) {
      const keyChar = key[keyIndex % keyLength].toLowerCase();
      const isUpperCase = textChar === textChar.toUpperCase();
      const textCode = textChar.toLowerCase().charCodeAt(0) - 97;
      const keyCode = keyChar.charCodeAt(0) - 97;

      const decryptedCode = (textCode - keyCode + 26) % 26;
      const decryptedChar = String.fromCharCode(decryptedCode + 97);

      result.push(isUpperCase ? decryptedChar.toUpperCase() : decryptedChar);
      keyIndex++;
    } else {
      result.push(textChar);
    }
  }

  return result.join("");
}
