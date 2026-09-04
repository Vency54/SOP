import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import QRCode from "qrcode";

import { prisma } from "@/lib/prisma";
import { gerarSegredo, gerarUri } from "@/lib/2fa";
import { compararTokens } from "@/lib/csrf";

export async function POST(request) {
  try {
    const cookieStore = await cookies();

    // Verificação CSRF
    const csrfToken = request.headers.get("X-CSRF-Token");
    const csrfTokenCookie = cookieStore.get("csrfToken")?.value;

    if (!compararTokens(csrfToken, csrfTokenCookie)) {
      return NextResponse.json(
        { mensagem: "Token CSRF inválido." },
        { status: 403 },
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

    if (!usuario) {
      return NextResponse.json(
        { mensagem: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    // Se já existe um segredo e o 2FA ainda não foi ativado,
    // reutiliza o mesmo segredo.
    let segredo = usuario.segredo2FA;

    if (!segredo || usuario.ativo2FA) {
      segredo = gerarSegredo();

      await prisma.user.update({
        where: {
          id: usuario.id,
        },
        data: {
          segredo2FA: segredo,
          ativo2FA: false,
        },
      });
    }

    const uri = gerarUri(usuario.usuario, segredo);

    const qrCode = await QRCode.toDataURL(uri);

    return NextResponse.json({
      qrCode,
    });
  } catch (erro) {
    console.error(erro);

    return NextResponse.json(
      { mensagem: "Erro ao gerar o QR Code." },
      { status: 500 },
    );
  }
}
