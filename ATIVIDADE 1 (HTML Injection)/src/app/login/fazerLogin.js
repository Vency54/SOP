"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fazerLogin(prevState, formData) {
  const usuario = formData.get("usuario");
  const senha = formData.get("senha");

  if (!usuario || !senha) {
    return {
      message: "Preencha todos os campos",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      usuario: usuario.toString(),
    },
  });

  if (!user || user.senha !== senha.toString()) {
    return {
      message: "Usuário ou senha incorretos",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("usuarioLogado", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}
