"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { compararTokens } from "@/lib/csrf";

export async function criarUsuario(prevState, formData) {
  const csrfToken = formData.get("csrfToken");

  const cookieStore = await cookies();

  const csrfTokenCookie = cookieStore.get("csrfToken")?.value;

  if (!compararTokens(csrfToken, csrfTokenCookie)) {
    return {
      message: "Token CSRF inválido.",
    };
  }

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

  const novoUsuario = await prisma.user.create({
    data: {
      usuario: usuario.toString(),
      senha: senha.toString(),
    },
  });

  cookieStore.set("usuarioId", novoUsuario.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/configurar-2fa");
}
