"use server";

import { cookies } from "next/headers";

export async function limparTentativas() {
  const cookieStore = await cookies();

  cookieStore.delete("tentativas");
}
