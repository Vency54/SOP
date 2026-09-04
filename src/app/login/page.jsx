"use client";

import styles from "./login.module.css";

import { useActionState, useState, useEffect } from "react";

import { fazerLogin } from "./fazerLogin";

import { limparTentativas } from "./limparTentativa";

import Link from "next/link";

export default function Login() {
  const estadoInicial = {
    message: "",
    bloqueado: false,
    tempo: 0,
  };

  const [estado, formAction, pendente] = useActionState(
    fazerLogin,
    estadoInicial,
  );

  const [tick, setTick] = useState(0);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    async function obterCSRF() {
      try {
        const resposta = await fetch("/api/csrf");

        const dados = await resposta.json();

        setCsrfToken(dados.csrfToken);
      } catch (erro) {
        console.error("Erro ao obter token CSRF:", erro);
      }
    }

    obterCSRF();
  }, []);

  useEffect(() => {
    if (!estado.bloqueado) return;

    const intervalo = setInterval(() => {
      setTick((valor) => valor + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [estado.bloqueado]);

  const tempoRestante = Math.max(0, estado.tempo - tick);

  useEffect(() => {
    if (estado.bloqueado && tempoRestante === 0) {
      async function resetar() {
        await limparTentativas();
        window.location.reload();
      }

      resetar();
    }
  }, [estado.bloqueado, tempoRestante]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Login</h2>

        <form action={formAction} className={styles.forms}>
          <input type="hidden" name="csrfToken" value={csrfToken} />

          <label htmlFor="usuario">Usuário</label>

          <input
            type="text"
            name="usuario"
            id="usuario"
            required
            disabled={pendente || estado.bloqueado}
          />

          <label htmlFor="senha">Senha</label>

          <input
            type="password"
            name="senha"
            id="senha"
            required
            disabled={pendente || estado.bloqueado}
          />

          <button
            type="submit"
            disabled={pendente || estado.bloqueado || !csrfToken}
          >
            {estado.bloqueado
              ? `Aguarde ${tempoRestante}s`
              : pendente
                ? "Entrando..."
                : "Entrar"}
          </button>

          {estado.message && <p>{estado.message}</p>}

          <Link href="/cadastro">
            <button type="button">Criar conta</button>
          </Link>
        </form>
      </div>
    </div>
  );
}
