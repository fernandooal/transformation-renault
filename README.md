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
frontend/
├── design/                referência visual exportada do Figma (telas, style-guide)
└── src/
    ├── main.tsx           bootstrap (router + AuthProvider)
    ├── App.tsx            mapa de rotas (AuthLayout · AppLayout)
    ├── assets/            logo RGdB e arte de fundo das telas de autenticação
    ├── models/            domínio: status, roles, f4, dashboard, auth, navigation,
    │                      o schema do formulário F4 (f4Form) e as colunas da
    │                      exportação (f4Export)
    ├── services/          acesso a dados (http, auth, f4, dashboard, document, chat)
    │   └── mock/          dataset da DEMO no domínio da mentoria
    ├── controllers/       hooks com estado e regras (useLogin, useCadastro,
    │                      useRecuperarSenha, useDashboard, useF4List, useF4Detail,
    │                      useF4Form, useF4Export, useChat, AuthContext)
    ├── utils/             funções puras (cx, format, datetime, validation, geometry,
    │                      spreadsheet)
    ├── styles/            tokens.css · base · utilities · layout · components/* · legacy
    └── views/
        ├── layouts/       AuthLayout (fundo escuro + card de vidro) e AppLayout (sidebar)
        ├── pages/         Login, Cadastro, RecuperarSenha, Dashboards, TodasAsF4s,
        │                  F4Detail, NewF4, DocumentView, ControleAcesso, Fornecedores
        └── components/
            ├── ui/        primitivos (Button, TextField, Card, DataTable, Modal…)
            ├── icons/     SVGs próprios, um Icon tipado por nome
            ├── charts/    StackedBarChart, PieChart, ChartLegend (SVG próprio)
            └── f4/        peças da F4 (fluxo, timeline, partes, documentos e
                           assinaturas, modal de exportação)
```

Fluxo de uma tela:

```
view (JSX) → controller (hook) → service (fetch ou mock) → API
```

- **Model** — formato dos dados e vocabulário do domínio. `models/status.ts` é o
  **ponto único de verdade** dos 8 status da F4: mudar rótulo, cor ou agrupamento de
  filtro é um arquivo só. `models/f4Form.ts` descreve o formulário F4 inteiro em dados,
  e `models/f4Export.ts` as colunas que saem no arquivo exportado.
- **Service** — única camada que conhece URLs, `fetch` e os mocks; injeta o JWT e
  normaliza erros.
- **Controller** — hooks que guardam estado, filtram, calculam e chamam os services.
- **View** — só recebe valores e renderiza; mantém apenas estado visual.

Uma view não chama `fetch` diretamente, e um hook de controller não devolve JSX.

#### Design system

Os tokens vivem em `styles/tokens.css` e **nenhum outro arquivo escreve hex**. Vêm do
style-guide do Figma: Poppins nos títulos e Lato no corpo, primárias
(`#4713A4` `#2307AF` `#8467AD` + neutros) para 75% da interface e auxiliares
(`#160B3D` `#66D8D0` `#4B9AF6` `#E0D9EC`) para os 25% restantes.

Duas exceções documentadas no próprio arquivo: as cores de texto dos badges verde e
laranja foram escurecidas até passar 4,5:1 contra o próprio fundo — no par literal do
style-guide elas ficam em 3,0:1 e 3,2:1, ilegíveis em 12px. Reverter são três linhas.

`styles/legacy.css` guarda o CSS herdado da DEMO monocromática que ainda não tem design
próprio (formulário F4, visualizador de PDF, chatbot). Uma ponte no topo reaponta as
variáveis antigas para os tokens novos.

#### Dados: mock por padrão

O backend ainda fala o vocabulário antigo (`Draft` / `In approval` / `Signed` / `Late`,
cargo único `Demo`) e não tem cadastro, recuperação de senha, histórico de workflow nem
métricas de dashboard. Enquanto isso, o frontend serve um dataset próprio:

| Variável | Default | O que controla |
|---|---|---|
| `VITE_MOCK_API` | `true` | dataset de F4 (10 documentos nos 8 status) e números do dashboard |
| `VITE_MOCK_AUTH` | `true` | cadastro e recuperação de senha (código fixo `1790`) |

O login é **real** em qualquer caso: `auth.service.ts` envia `{ email, username, password }`
enquanto o backend for username-only — é o único ponto do frontend que conhece a
divergência. Os números do dashboard marcados `// MOCK —` em `services/mock/dashboard.mock.ts`
são os que dependem do histórico de workflow; o resto é derivado do dataset.

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
cp .env.example .env   # opcional: só para desligar os mocks
npm run dev            # http://localhost:5173 (proxy /api -> :3001)
```

Abra `http://localhost:5173` no navegador. Em desenvolvimento, `/__ui` mostra o kit de
componentes (primitivos, badges dos 8 status, gráficos) para comparar com o style-guide.

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
