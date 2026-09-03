"use server";

import { prisma } from "@/lib/prisma";

export async function criarUsuario(prevState, formData) {
  const usuario = formData.get("usuario");
  const senha = formData.get("senha");

  if (!usuario || !senha) {
    return {
      message: "Preencha todos os campos",
    };
  }

  const usuarioExistente = await prisma.user.findUnique({
    where: {
      usuario: usuario.toString(),
    },
  });

  if (usuarioExistente) {
    return {
      message: "Esse usuário já existe",
    };
  }

  await prisma.user.create({
    data: {
      usuario: usuario.toString(),
      senha: senha.toString(),
    },
  });

  return {
    message: "Usuário criado com sucesso!",
  };
}
