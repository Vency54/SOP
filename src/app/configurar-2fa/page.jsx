"use client";

import { useEffect, useState } from "react";
import styles from "./configurar-2fa.module.css";

export default function Configurar2FA() {
  const [qrCode, setQrCode] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    async function obterCSRF() {
      try {
        const resposta = await fetch("/api/csrf");

        const dados = await resposta.json();

        setCsrfToken(dados.csrfToken);
      } catch (erro) {
        console.error(erro);
        setMensagem("Erro ao obter proteção CSRF.");
      }
    }

    obterCSRF();
  }, []);

  useEffect(() => {
    if (!csrfToken) return;

    gerarQR();
  }, [csrfToken]);

  async function gerarQR() {
    setMensagem("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/2fa/gerar", {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.mensagem);
        return;
      }

      setQrCode(dados.qrCode);
    } catch (erro) {
      console.error(erro);
      setMensagem("Erro ao gerar o QR Code.");
    } finally {
      setCarregando(false);
    }
  }

  async function confirmar() {
    if (codigo.length !== 6) {
      setMensagem("Digite o código de 6 números.");
      return;
    }

    setMensagem("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/2fa/confirmar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          codigo,
        }),
      });

      const dados = await resposta.json();

      setMensagem(dados.mensagem);

      if (resposta.ok) {
        setCodigo("");
        window.location.href = "/login";
      }
    } catch (erro) {
      console.error(erro);
      setMensagem("Erro ao confirmar o 2FA.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Configurar 2FA</h1>

        <p>Escaneie o QR Code com o Google Authenticator.</p>

        {carregando && !qrCode && (
          <p className={styles.carregando}>Gerando QR Code...</p>
        )}

        {qrCode && (
          <>
            <div className={styles.qrContainer}>
              <img
                src={qrCode}
                alt="QR Code para configurar o 2FA"
                className={styles.qrCode}
              />
            </div>

            <p>
              Depois, digite o código de 6 números mostrado no Google
              Authenticator.
            </p>

            <label htmlFor="codigo" className={styles.label}>
              Código
            </label>

            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, "").slice(0, 6);

                setCodigo(valor);
              }}
              maxLength={6}
              placeholder="123456"
              className={styles.input}
            />

            <button
              onClick={confirmar}
              disabled={carregando || codigo.length !== 6 || !csrfToken}
              className={styles.button}
            >
              {carregando ? "Verificando..." : "Ativar 2FA"}
            </button>
          </>
        )}

        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
      </div>
    </main>
  );
}
