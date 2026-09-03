# Login App

Aplicação web simples de cadastro e login desenvolvida com Next.js, JavaScript, Prisma e SQLite.

## Tecnologias

- Next.js
- JavaScript
- Prisma 6.16.2
- SQLite
- React

## Requisitos

Antes de executar o projeto, tenha instalado:

- Node.js
- npm

Verifique no terminal:

node --version
npm --version

## Instalação

Entre na pasta do projeto:

cd login-app

Instale as dependências:

npm install

## Configuração do banco

O projeto utiliza SQLite através do Prisma.

Confira se existe o arquivo .env na raiz do projeto:

DATABASE_URL="file:./dev.db"

Depois execute:

npx prisma migrate dev

Gere o Prisma Client:

npx prisma generate

O banco será criado em:

prisma/dev.db

## Executando o projeto

Inicie o servidor:

npm run dev

Depois acesse:

http://localhost:3000

## Páginas

### Login

/login

Permite entrar utilizando um usuário cadastrado.

### Cadastro

/cadastro

Permite criar um novo usuário.

### Home

/

A Home é protegida e só pode ser acessada depois do login.

### Logout

O botão Sair remove o estado de login e redireciona o usuário para:

/login

## Estrutura do projeto

login-app/
├── prisma/
│   ├── dev.db
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── cadastro/
│   │   │   ├── page.jsx
│   │   │   └── CriarUsuario.js
│   │   │
│   │   ├── login/
│   │   │   ├── page.jsx
│   │   │   └── actions.js
│   │   │
│   │   ├── logout/
│   │   │   └── actions.js
│   │   │
│   │   └── page.jsx
│   │
│   └── lib/
│       └── prisma.js
│
├── .env
├── package.json
└── README.md

## Fluxo da aplicação

Login
  ↓
Verificação do usuário
  ↓
Cookie de autenticação
  ↓
Home
  ↓
Logout
  ↓
Login

## Prisma Studio

Para visualizar os usuários cadastrados no banco:

npx prisma studio

## Comandos principais

Instalar dependências:

npm install

Criar ou atualizar o banco:

npx prisma migrate dev

Gerar Prisma Client:

npx prisma generate

Iniciar aplicação:

npm run dev

Abrir Prisma Studio:

npx prisma studio

## Observação

Este projeto foi desenvolvido como uma aplicação de estudo.

A implementação atual de autenticação deve ser aprimorada antes de ser utilizada em produção, especialmente no armazenamento e tratamento das senhas e no gerenciamento de sessões.
