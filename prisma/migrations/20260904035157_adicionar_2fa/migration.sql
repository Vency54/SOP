-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "segredo2FA" TEXT,
    "ativo2FA" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "senha", "usuario") SELECT "id", "senha", "usuario" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_usuario_key" ON "User"("usuario");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
