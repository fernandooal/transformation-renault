# Renault Transformation Day

Aplicação web (DEMO) para o projeto de gestão da documentação **F4** — termos contratuais de compra de materiais com terceiros. A estrutura definitiva do F4 será definida posteriormente; esta versão entrega a base da plataforma.

## Características básicas

- **Autenticação JWT** — login com token Bearer (validade de 8h)
- **RBAC (controle por cargo)** — middleware genérico `requireRole(...)`; nesta fase existe apenas o cargo `Demo`
- **Chatbot com IA** — assistente integrado via API de LLM; a chave e o prompt de sistema ficam somente no backend
- **Visualização de PDF** — documentos F4 renderizados no navegador (react-pdf / pdf.js)
- **Frontend propositalmente básico** — apenas o necessário para a DEMO

> Futuramente a aplicação poderá ser empacotada com Electron; por enquanto o foco é a versão web.

## Stack

| Camada    | Tecnologias |
|-----------|-------------|
| Backend   | Node.js + TypeScript (execução nativa de .ts), Express, jsonwebtoken, bcryptjs, API Google Gemini |
| Frontend  | React 18 + TypeScript, Vite, react-router-dom, react-pdf |
| Dados     | JSON em arquivo (`backend/data/users.json`, criado automaticamente) |

## Arquitetura

O projeto é um monolito simples, mas ambos os lados seguem **MVC**: cada camada tem uma
responsabilidade única e só conversa com a camada vizinha.

### Backend — MVC clássico

```
backend/src/
├── server.ts              entrypoint: seed + listen
├── app.ts                 monta o Express (middlewares globais + rotas)
├── config/                variáveis de ambiente em um só lugar
├── routes/                URL → controller (nenhuma regra aqui)
├── controllers/           lê req, chama model/service, devolve res
├── models/                dados e regras de domínio (users, documentos F4)
├── services/              integrações externas (JWT, Google Gemini)
├── middlewares/           autenticação e RBAC
├── validators/            validação do corpo das requisições
└── types/                 interfaces compartilhadas
```

Fluxo de uma requisição:

```
request → middleware (requireAuth/requireRole) → route → validator → controller → model/service → response
```

| Camada       | Faz                                                | Não faz                              |
|--------------|----------------------------------------------------|--------------------------------------|
| `routes`     | declara caminho, método e middlewares               | lógica de negócio                    |
| `controllers`| traduz HTTP ↔ domínio, escolhe o status code        | acessar arquivo/banco ou API externa |
| `models`     | guarda e calcula os dados (usuários, F4, métricas)  | conhecer `req`/`res`                 |
| `services`   | fala com o mundo externo (JWT, LLM)                 | conhecer `req`/`res`                 |

Regra prática: um controller nunca importa `fs`/`fetch`, e um model nunca importa `express`.
Hoje `document.model.ts` mantém um array em memória — quando entrar o banco, só esse arquivo muda.

### Frontend — MVC adaptado ao React

```
frontend/src/
├── main.tsx               bootstrap (router + AuthProvider)
├── App.tsx                mapa de rotas
├── models/                tipos do domínio + schema do formulário F4
├── services/              acesso à API (http, auth, document, chat)
├── controllers/           hooks com estado e regras (useDocuments, useF4Form, useChat, AuthContext)
└── views/
    ├── pages/             telas completas (Login, Dashboard, DocumentView, NewF4)
    └── components/        peças reutilizáveis (Chatbot, F4Field, ProtectedRoute)
```

Fluxo de uma tela:

```
view (JSX) → controller (hook) → service (fetch) → API
```

- **Model** — formato dos dados. `models/f4Form.ts` descreve o formulário F4 inteiro em dados:
  editar `SECTIONS` altera a tela sem tocar em JSX.
- **Service** — única camada que conhece URLs e `fetch`; injeta o JWT e normaliza erros.
- **Controller** — hooks que guardam estado, filtram, calculam totais e chamam os services.
- **View** — só recebe valores e renderiza; mantém apenas estado visual (painel aberto, página do PDF).

Uma view não chama `fetch` diretamente, e um hook de controller não devolve JSX.

## Como rodar

Pré-requisito: Node.js 18+.

### 1. Backend

```sh
cd backend
npm install
cp .env.example .env   # preencha a GEMINI_API_KEY e um JWT_SECRET próprio
npm run dev            # API em http://localhost:3001
```

Na primeira execução o servidor cria `backend/data/users.json` com o usuário de demonstração. Sem a chave de LLM no `.env`, todo o sistema funciona, exceto o chatbot (que responde com uma mensagem de indisponibilidade).

### 2. Frontend

```sh
cd frontend
npm install
npm run dev            # http://localhost:5173 (proxy /api -> :3001)
```

Abra `http://localhost:5173` no navegador.

### Credenciais da DEMO

| Usuário | Senha     | Cargo |
|---------|-----------|-------|
| `demo`  | `demo123` | Demo  |

## API (resumo)

| Rota                        | Método | Auth          | Descrição                          |
|-----------------------------|--------|---------------|------------------------------------|
| `/api/health`               | GET    | —             | Health check                       |
| `/api/auth/login`           | POST   | —             | Login → `{ token, user }`          |
| `/api/auth/me`              | GET    | Bearer        | Dados do usuário logado            |
| `/api/documents`            | GET    | Bearer + Demo | Lista de documentos F4 (mock)      |
| `/api/documents/metrics`    | GET    | Bearer + Demo | Métricas agregadas do dashboard    |
| `/api/documents`            | POST   | Bearer + Demo | Cria uma F4 (memória)              |
| `/api/documents/:id/file`   | GET    | Bearer + Demo | Arquivo PDF do documento           |
| `/api/chat`                 | POST   | Bearer + Demo | Chatbot (`{ messages: [...] }`)    |

## Limitações conhecidas da DEMO

- Faltam de propósito: cadastro de usuários, recuperação de senha, administração de cargos e persistência real dos documentos F4.
- O RBAC já é genérico (`requireRole("admin", "user", ...)`) — novos cargos entram sem refatoração.
- A IA entrará em mais pontos do sistema além do chatbot em fases futuras.
- **Nunca commitar chaves reais**: o `.env` está no `.gitignore`; o `.env.example` deve conter apenas placeholders.
