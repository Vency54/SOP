import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verificarCodigo } from "@/lib/2fa";
import { compararTokens } from "@/lib/csrf";

export async function POST(request) {
  try {
    const body = await request.json();
    const codigo = body.codigo;

    const cookieStore = await cookies();

    // Verificar CSRF
    const csrfToken = request.headers.get("X-CSRF-Token");
    const csrfTokenCookie = cookieStore.get("csrfToken")?.value;

    if (!compararTokens(csrfToken, csrfTokenCookie)) {
      return NextResponse.json(
        { mensagem: "Token CSRF inválido." },
        { status: 403 },
      );
    }

    // Verificar código
    if (!codigo) {
      return NextResponse.json(
        { mensagem: "Digite o código." },
        { status: 400 },
      );
    }

    // Pegar usuário que está aguardando o 2FA
    const usuarioId = cookieStore.get("usuario2FA")?.value;

    if (!usuarioId) {
      return NextResponse.json(
        { mensagem: "Usuário não encontrado." },
        { status: 401 },
      );
    }

    // Buscar usuário
    const usuario = await prisma.user.findUnique({
      where: {
        id: Number(usuarioId),
      },
    });

    if (!usuario || !usuario.segredo2FA) {
      return NextResponse.json(
        { mensagem: "2FA não configurado." },
        { status: 400 },
      );
    }

    // Verificar código do Authenticator
    const valido = await verificarCodigo(codigo, usuario.segredo2FA);

    if (!valido) {
      return NextResponse.json(
        { mensagem: "Código incorreto." },
        { status: 401 },
      );
    }

    // Código correto
    const resposta = NextResponse.json({
      mensagem: "Código correto.",
    });

    // Usuário está autenticado
    resposta.cookies.set("usuarioId", usuario.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // IMPORTANTE:
    // Indica que o login foi concluído
    resposta.cookies.set("usuarioLogado", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Remove o cookie temporário do 2FA
    resposta.cookies.delete("usuario2FA");

    return resposta;
  } catch (erro) {
    console.error(erro);

    return NextResponse.json(
      { mensagem: "Erro ao verificar o código." },
      { status: 500 },
    );
  }
}
