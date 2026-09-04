import { generateSecret, generateURI, verify } from "otplib";

export function gerarSegredo() {
  return generateSecret();
}

export function gerarUri(usuario, segredo) {
  return generateURI({
    issuer: "Meu Sistema",
    label: usuario,
    secret: segredo,
  });
}

export async function verificarCodigo(codigo, segredo) {
  const resultado = await verify({
    secret: segredo,
    token: codigo,
  });

  return resultado.valid;
}
