"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./verificacao.module.css";

export default function Verificacao() {
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const router = useRouter();

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

  async function verificar() {
    if (codigo.length !== 6) {
      setMensagem("Digite o código de 6 números.");
      return;
    }

    if (!csrfToken) {
      setMensagem("Token CSRF não disponível.");
      return;
    }

    setMensagem("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/2fa/verificar", {
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

      if (!resposta.ok) {
        setMensagem(dados.mensagem);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (erro) {
      console.error(erro);
      setMensagem("Erro ao verificar o código.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Autenticação em dois fatores</h1>

        <p>Abra o Google Authenticator e digite o código mostrado.</p>

        <label htmlFor="codigo" className={styles.label}>
          Código de autenticação
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
          onClick={verificar}
          disabled={carregando || codigo.length !== 6 || !csrfToken}
          className={styles.button}
        >
          {carregando ? "Verificando..." : "Verificar"}
        </button>

        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
      </div>
    </main>
  );
}
