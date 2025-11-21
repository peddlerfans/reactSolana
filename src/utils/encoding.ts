// src/utils/encoding.ts
export function toBase64(input: Uint8Array | any): string {
  if (input instanceof Uint8Array) {
    // browser btoa expects string, so convert bytes
    let binary = "";
    const len = input.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(input[i]);
    }
    return btoa(binary);
  }
  // if adapter returns object with signature property
  if (input?.signature) {
    return toBase64(input.signature);
  }
  try {
    return btoa(String(input));
  } catch {
    return "";
  }
}
