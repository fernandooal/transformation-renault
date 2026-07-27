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
| Backend   | Node.js, Express, jsonwebtoken, bcryptjs, SDK de LLM |
| Frontend  | React 18, Vite, react-router-dom, react-pdf |
| Dados     | JSON em arquivo (`backend/data/users.json`, criado automaticamente) |

## Estrutura

```
backend/   API Express — módulos: auth/ (JWT + RBAC), users/, chat/ (IA), documents/ (F4)
frontend/  React + Vite — pages/ (Login, Dashboard, Visualizador), components/ (Chatbot)
```

## Como rodar

Pré-requisito: Node.js 18+.

### 1. Backend

```sh
cd backend
npm install
cp .env.example .env   # preencha a chave da API de LLM e um JWT_SECRET próprio
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
| `/api/documents/:id/file`   | GET    | Bearer + Demo | Arquivo PDF do documento           |
| `/api/chat`                 | POST   | Bearer + Demo | Chatbot (`{ messages: [...] }`)    |

## Limitações conhecidas da DEMO

- Faltam de propósito: cadastro de usuários, recuperação de senha, administração de cargos e persistência real dos documentos F4.
- O RBAC já é genérico (`requireRole("admin", "user", ...)`) — novos cargos entram sem refatoração.
- A IA entrará em mais pontos do sistema além do chatbot em fases futuras.
- **Nunca commitar chaves reais**: o `.env` está no `.gitignore`; o `.env.example` deve conter apenas placeholders.
