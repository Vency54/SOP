"use server";

import { compararTokens } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fazerLogin(prevState, formData) {
  const csrfToken = formData.get("csrfToken");

  const cookieStore = await cookies();

  const csrfTokenCookie = cookieStore.get("csrfToken")?.value;

  if (!compararTokens(csrfToken, csrfTokenCookie)) {
    return {
      message: "Token CSRF inválido.",
      bloqueado: false,
      tempo: 0,
    };
  }

  const usuario = formData.get("usuario");
  const senha = formData.get("senha");

  if (!usuario || !senha) {
    return {
      message: "Preencha todos os campos",
    };
  }

  let contador = Number(cookieStore.get("tentativas")?.value || 0);

  if (contador >= 5) {
    return {
      message: "Você atingiu o limite de tentativas",
      bloqueado: true,
      tempo: 30,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      usuario: usuario.toString(),
    },
  });

  console.log("Usuário digitado:", usuario.toString());
  console.log("Resultado da busca:", user);

  if (!user || user.senha !== senha.toString()) {
    contador++;

    cookieStore.set("tentativas", contador.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return {
      message: "Usuário ou senha incorretos",
      bloqueado: contador >= 5,
      tempo: contador >= 5 ? 30 : 0,
    };
  }

  console.log("Usuário:", user.usuario);
  console.log("2FA ativo:", user.ativo2FA);

  cookieStore.delete("tentativas");

  cookieStore.set("usuarioId", user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  if (user.ativo2FA) {
    cookieStore.set("usuario2FA", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 300,
    });

    redirect("/verificacao");
  }

  cookieStore.set("usuarioLogado", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}
