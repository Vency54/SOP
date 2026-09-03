"use client";

import styles from "./login.module.css";
import { useActionState } from "react";
import { fazerLogin } from "./fazerLogin";
import Link from "next/link";


export default function Login() {
    const estadoInicial = {
        message: "",
    };

    const [estado, formAction, pendente] = useActionState(
        fazerLogin,
        estadoInicial
    );

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Login</h2>

                <form action={formAction} className={styles.forms}>
                    <label htmlFor="usuario">Usuário</label>

                    <input
                        type="text"
                        name="usuario"
                        id="usuario"
                        required
                    />

                    <label htmlFor="senha">Senha</label>

                    <input
                        type="password"
                        name="senha"
                        id="senha"
                        required
                    />

                    <button type="submit" disabled={pendente}>
                        {pendente ? "Entrando..." : "Entrar"}
                    </button>

                    {estado.message && <p>{estado.message}</p>}
                    <Link href="/cadastro">
                        <button type="button">
                            Criar conta
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
}
