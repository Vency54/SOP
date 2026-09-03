import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fazerLogout } from "./logout/logout";
import styles from "./page.module.css";

export default async function Home() {
  const cookieStore = await cookies();

  const usuarioLogado = cookieStore.get("usuarioLogado");

  if (!usuarioLogado) {
    redirect("/login");
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Bem-vindo</h1>

        <p>Você está logado com sucesso.</p>

        <form action={fazerLogout}>
          <button className={styles.logout} type="submit">
            Sair
          </button>
        </form>
      </div>
    </main>
  );
}

