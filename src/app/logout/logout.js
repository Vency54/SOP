"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fazerLogout() {
  const cookieStore = await cookies();

  cookieStore.delete("usuarioLogado");
  cookieStore.delete("usuarioId");
  cookieStore.delete("usuario2FA");

  redirect("/login");
}
