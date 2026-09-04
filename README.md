# Sistema de Login - Next.js

Projeto desenvolvido em Next.js com JavaScript, Prisma e SQLite.

## Requisitos

É necessário ter instalado:

- Node.js
- npm

Para verificar:

```bash
node -v
npm -v
```

## 1. Baixar o projeto

Abra o terminal e execute:

```bash
git clone https://github.com/Vency54/SOP.git
```

Entre na pasta:

```bash
cd SOP
```

Para utilizar a versão protegida:

```bash
git checkout Protegida
```

## 2. Instalar as dependências

Execute:

```bash
npm install
```

## 3. Configurar o banco de dados

Crie um arquivo chamado `.env` na raiz do projeto.

Dentro dele, coloque:

```env
DATABASE_URL="file:./dev.db"
```

## 4. Criar o banco de dados

Execute:

```bash
npx prisma migrate dev
```

Depois:

```bash
npx prisma generate
```

Esses comandos irão criar o banco SQLite e gerar o Prisma Client.

## 5. Executar o projeto

Execute:

```bash
npm run dev
```

Depois abra o navegador e acesse:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
SOP/
├── prisma/
├── public/
├── src/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Tecnologias utilizadas

- Next.js
- React
- JavaScript
- Prisma
- SQLite
- CSS Modules

## Comandos principais

Instalar dependências:

```bash
npm install
```

Gerar Prisma Client:

```bash
npx prisma generate
```

Criar/atualizar banco:

```bash
npx prisma migrate dev
```

Executar o projeto:

```bash
npm run dev
```

Acessar o sistema:

```text
http://localhost:3000
```

## Observação

O arquivo `.env` não deve ser enviado para o GitHub.

O banco SQLite é criado localmente através das migrations do Prisma.

Caso seja uma instalação nova, execute os comandos na seguinte ordem:

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```
