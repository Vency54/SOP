import crypto from "crypto";

export function gerarTokenCSRF() {
  return crypto.randomBytes(32).toString("hex");
}

export function compararTokens(token1, token2) {
  if (!token1 || !token2) {
    return false;
  }

  const buffer1 = Buffer.from(token1);
  const buffer2 = Buffer.from(token2);

  if (buffer1.length !== buffer2.length) {
    return false;
  }

  return crypto.timingSafeEqual(buffer1, buffer2);
}
