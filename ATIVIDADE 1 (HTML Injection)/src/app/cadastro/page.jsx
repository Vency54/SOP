"use client";

import styles from "./cadastro.module.css";
import { useActionState } from "react";
import {criarUsuario} from "./CriarUsuario"
import Link from "next/link";

export default function Login() {
  const estadoInicial = {
    message: "",
  };

  const [estado, formAction, pendente] = useActionState(
    criarUsuario,
    estadoInicial
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Cadastro</h2>

        <form action={formAction} className={styles.forms}>
          <label htmlFor="usuario">Crie o usuário</label>

          <input
            type="text"
            name="usuario"
            id="usuario"
            required
          />

          <label htmlFor="senha">Crie a senha</label>

          <input
            type="password"
            name="senha"
            id="senha"
            required
          />

          <button
            className="btn btn-primary text-white border bg-black p-2 my-2 h-10"
            disabled={pendente}
          >
            {pendente ? "Cadastrando..." : "Cadastrar"}
          </button>

          {estado.message && <p>{estado.message}</p>}
          <Link href="/login">
                        <button type="button">
                            Voltar para login
                        </button>
                    </Link>
        </form>
      </div>
    </div>
  );
}
