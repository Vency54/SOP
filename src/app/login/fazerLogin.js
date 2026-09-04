"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fazerLogin(prevState, formData) {
  const cookieStore = await cookies();

  const usuario = formData.get("usuario")?.toString();
  const senha = formData.get("senha")?.toString();

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

  /* 
    --------------------------------------------------------------------------
    VULNERABILIDADE (SQL INJECTION):
    Uso de $queryRawUnsafe concatenando strings diretamente.
    Se o usuário digitar: admin' --
    A query montada ignora o resto da verificação de senha no banco.
    --------------------------------------------------------------------------
  */
  const query = `SELECT * FROM "User" WHERE usuario = '${usuario}' AND senha = '${senha}'`;
  
  // Executa a query sem sanitização
  const users = await prisma.$queryRawUnsafe(query);
  const user = users.length > 0 ? users[0] : null;

  if (!user) {
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

  cookieStore.delete("tentativas");

  cookieStore.set("usuarioId", user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });


  cookieStore.set("usuarioLogado", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}