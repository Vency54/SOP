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

    // Verifica CSRF
    const csrfToken = request.headers.get("X-CSRF-Token");
    const csrfTokenCookie = cookieStore.get("csrfToken")?.value;

    if (!compararTokens(csrfToken, csrfTokenCookie)) {
      return NextResponse.json(
        { mensagem: "Token CSRF inválido." },
        { status: 403 },
      );
    }

    if (!codigo) {
      return NextResponse.json(
        { mensagem: "Digite o código." },
        { status: 400 },
      );
    }

    const usuarioId = cookieStore.get("usuarioId")?.value;

    if (!usuarioId) {
      return NextResponse.json(
        { mensagem: "Usuário não está logado." },
        { status: 401 },
      );
    }

    const usuario = await prisma.user.findUnique({
      where: {
        id: Number(usuarioId),
      },
    });

    if (!usuario || !usuario.segredo2FA) {
      return NextResponse.json(
        { mensagem: "2FA ainda não foi configurado." },
        { status: 400 },
      );
    }

    const valido = await verificarCodigo(codigo, usuario.segredo2FA);

    if (!valido) {
      return NextResponse.json(
        { mensagem: "Código incorreto." },
        { status: 401 },
      );
    }

    await prisma.user.update({
      where: {
        id: usuario.id,
      },
      data: {
        ativo2FA: true,
      },
    });

    return NextResponse.json({
      mensagem: "2FA ativado com sucesso!",
    });
  } catch (erro) {
    console.error(erro);

    return NextResponse.json(
      { mensagem: "Erro ao confirmar o 2FA." },
      { status: 500 },
    );
  }
}
