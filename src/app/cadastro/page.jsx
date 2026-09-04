"use client";

import styles from "./cadastro.module.css";

import { useActionState, useEffect, useState } from "react";

import { criarUsuario } from "./CriarUsuario";

import Link from "next/link";

export default function Cadastro() {
  const estadoInicial = {
    message: "",
  };

  const [estado, formAction, pendente] = useActionState(
    criarUsuario,
    estadoInicial,
  );

  const [csrfToken, setCsrfToken] = useState("");

  // Busca o token CSRF
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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Cadastro</h2>

        <form action={formAction} className={styles.forms}>
          {/* TOKEN CSRF */}
          <input type="hidden" name="csrfToken" value={csrfToken} />

          <label htmlFor="usuario">Crie o usuário</label>

          <input type="text" name="usuario" id="usuario" required />

          <label htmlFor="senha">Crie a senha</label>

          <input type="password" name="senha" id="senha" required />

          <button
            type="submit"
            className="btn btn-primary text-white border bg-black p-2 my-2 h-10"
            disabled={pendente || !csrfToken}
          >
            {pendente ? "Cadastrando..." : "Cadastrar"}
          </button>

          {estado.message && <p>{estado.message}</p>}

          <Link href="/login">
            <button type="button">Voltar para login</button>
          </Link>
        </form>
      </div>
    </div>
  );
}
