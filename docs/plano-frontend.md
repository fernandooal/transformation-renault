# Plano — Frontend (Fase 0)

## Contexto

O app hoje é uma DEMO funcional com tema monocromático improvisado: login, dashboard,
formulário F4 e chatbot, sobre um MVC React já bem separado (`models / services /
controllers / views`). Chegou um design completo da marca **RGdB — Renault Geely do
Brasil** (Figma, exportado em PDF/PNG) e, em paralelo, uma sessão de mentoria com o
cliente definiu o domínio real: 7 cargos, hierarquia, projetos e um workflow de
aprovação da F4 com 8 status.

Esta fase aplica o design novo ao app **sem tocar no backend**, adaptando o que o design
mostra ao domínio que a mentoria definiu. O objetivo é uma DEMO visualmente fiel e
navegável, com a camada de dados isolada atrás de adaptadores — para que, quando o
backend evoluir, só os adaptadores mudem.

## Decisões fechadas pelo cliente

| # | Decisão |
|---|---|
| 1 | **Cargos**: os 7 da mentoria (BUYER, PPM, RSPM, PFE, CVE, IST, CPSC) + Fornecedor. O select do cadastro no design ("Usuário Comum"/"Administrador") é descartado. |
| 2 | **Assinatura digital**: entra no futuro; por ora **mock** (botão "Aprovar e Assinar" registra evento, sem ICP-Brasil real). |
| 3 | **Conflito design × mentoria**: a **mentoria vale mais**. O design é adaptado a ela (4 etapas de fluxo, 8 status). |
| 4 | **Escopo**: **somente frontend**. Backend não é responsabilidade nesta fase. |

## Escopo

**Entra:** design system completo (tokens, tipografia, cores), dois layouts (auth e app),
biblioteca de componentes, as 6 telas de autenticação, Dashboards, Todas as F4's,
detalhe da F4 com as 4 abas, placeholders de Controle de acesso e Fornecedores, e uma
camada de dados mock que representa o domínio da mentoria.

**Não entra:** qualquer alteração em `backend/`; assinatura digital real; envio de
e-mail real; i18n; tela de Projetos (fica para quando o domínio de projetos entrar).

---

## 1. Fonte de verdade do domínio (`models/`)

O design e a mentoria divergem no vocabulário. A mentoria manda; o design contribui com
a linguagem visual. Ponto único de verdade em `models/status.ts`:

```ts
export const F4_STATUSES = [
  "DRAFT", "TECH_REVIEW", "COMMERCIAL_REVIEW", "FINAL_REVIEW",
  "IN_REWORK", "APPROVED", "REJECTED", "CANCELLED",
] as const;
export type F4Status = (typeof F4_STATUSES)[number];
```

| Código | Rótulo (UI) | Tom | Origem |
|---|---|---|---|
| `DRAFT` | Rascunho | neutral | mentoria — só o fornecedor vê |
| `TECH_REVIEW` | Revisão Técnica | orange | mentoria + design |
| `COMMERCIAL_REVIEW` | Revisão Comercial | orange | mentoria + design |
| `FINAL_REVIEW` | Revisão Final | purple | mentoria (ausente no design) |
| `IN_REWORK` | Em Alteração | blue | mentoria (o design chama "Em Análise") |
| `APPROVED` | Aprovada | green | ambos |
| `REJECTED` | Reprovada | red | ambos |
| `CANCELLED` | Cancelada | neutral | mentoria (ausente no design) |

Cargos em `models/roles.ts` — 7 + Fornecedor, com departamento e rótulo, usados no select
do cadastro, nos badges de "Partes Envolvidas" e na coluna Responsável.

Chips de filtro da tela de F4's (agregam status, como no design):
`Todas` · `Em Revisão` (técnica+comercial+final) · `Em Alteração` · `Aprovadas` · `Reprovadas`.

## 2. Design system (`styles/`)

Quebrar o `styles.css` (610 linhas) em: `tokens.css`, `base.css`, `utilities.css`,
`layout.css`, `components/*.css` e `legacy.css`, agregados por `index.css` — único
import do `main.tsx`. `legacy.css` reescreve as variáveis antigas (`--ink`, `--line`,
`--surface`…) em cima das novas, para que as ~250 linhas do formulário F4, tabela SET,
visualizador de PDF e chatbot mudem de cor sem mudar de código.

**Tipografia** — Poppins (headlines) + Lato (corpo e números), via Google Fonts.
KPI numérico em Lato 64px.

**Cores** — hierarquia oficial do style-guide:
- Primárias (75%): `#FFFFFF` `#000000` `#E7E7E7` `#4713A4` `#2307AF` `#8467AD`
- Auxiliares (25%): `#160B3D` `#66D8D0` `#4B9AF6` `#E0D9EC`
- Pares de badge: `#2563EB`/`#EAF0FE` · `#E8590C`/`#FDEEE3` · `#4EC52D`/`#4EC52D30` · `#FB131B`
- Utilitárias: `#F9F8FC` (hover sobre branco) · `#E6E6E6` (stroke 1px)

**Specs medidos**: raio 16px · sombra `1px 1px 5px rgba(0,0,0,.15)` · controles 48px
(56px no CTA de auth) · linha de tabela 68px · card de vidro 505px.

Regra: **nenhum arquivo fora de `tokens.css` escreve hex.**

## 3. Componentes (`views/components/`)

`ui/` — Button, TextField, PasswordField, CodeInput, Checkbox, Select, Badge,
StatusBadge, Card, KpiCard, Avatar, SearchInput, FilterChips, DataTable, StagePills,
Modal, GlassCard, IconButton, Tabs, EmptyState, Skeleton, SectionTitle.

`icons/` — ~20 SVGs inline próprios (`currentColor`, stroke 1.75). Sem dependência: os
ícones de KPI do design são autorais e nenhuma biblioteca os entrega iguais.

`charts/` — StackedBarChart, PieChart, ChartLegend em SVG próprio (~150 linhas). São 3
instâncias, paleta fixa, sem interação no design; `recharts` custaria ~100 kB por nada.

Domínio: Sidebar, BrandLockup, PageHeader, AuthBackdrop, AttentionList, F4FlowStrip,
PartiesCard, ContinuityCard, HistoryTimeline, CommentComposer.

## 4. Telas e rotas (`App.tsx`)

```
AuthLayout    /login · /cadastro · /recuperar-senha (3 passos + modal)
AppLayout     /dashboards · /f4 · /f4/nova · /f4/:id
              /acessos · /fornecedores
```

Rotas aninhadas do react-router v6 (`<Route element={<AppLayout/>}><Outlet/>`),
`ProtectedRoute` preservado, Chatbot movido para dentro do `AppLayout`.

**`/f4/:id` (detalhe) — a peça central**, agora com design:
- Header: título, linha de metadados, ações `Devolver para a Revisão` e `Aprovar e Assinar`
- **Fluxo da F4**: 4 etapas adaptadas da mentoria — Fornecedor → Revisão Técnica →
  Revisão Comercial → Revisão Final (CVE) — cada uma com pessoa e status; chip de voltas
  ("3ª Volta • 2 Devoluções Técnicas, 1 Comercial")
- 4 abas: Histórico e Comentários · Comparar Versões · Checkpoints · Documentos e Assinaturas
- Rail direito: Partes Envolvidas (pessoa + badge de cargo) e Continuidade Garantida
  (eventos / voltas / checkpoints)

O conteúdo das abas está vazio no Figma. A referência de comportamento é o protótipo
`fluxo-f4 (2).html` (timeline com autor+cargo+tag, composer com "Criar checkpoint" /
"Anexar" / "Comentar") — reimplementado com os tokens RGdB.

`DashboardPage.tsx` atual é **dividida** (KPIs → Dashboards; busca+lista → Todas as F4's)
e apagada junto com `useDocuments.ts` no mesmo commit.

## 5. Camada de dados — sem backend

`services/mock/` com um dataset completo no domínio da mentoria: 7 cargos, ~10 F4s
cobrindo os 8 status, histórico por F4, partes envolvidas, checkpoints e as métricas do
dashboard (voltas, ciclo médio, tempo até aprovar, filas por etapa, série mensal).

`services/adapters/` traduz mock ↔ tipos de view. Onde o backend atual já responde
(`/api/auth/login`, `/api/documents`, `/api/chat`), o service tenta a API e cai no mock
em falha — controlado por `VITE_MOCK_API` (default `true`). Views e controllers nunca
sabem a origem do dado.

Login por e-mail: o adaptador envia `{ email, username: email, password }` enquanto o
backend for username-only. É o único ponto do front que conhece a divergência.

"Lembre de mim" → `localStorage`; desmarcado → `sessionStorage`.

## 6. Ordem de execução

| Etapa | Entrega | O que inspecionar |
|---|---|---|
| 1 | Ativos versionados em `frontend/design/`, fontes, logo e arte de fundo em SVG | app sobe |
| 2 | `tokens.css` + quebra do CSS + ponte legada; neutralizar o seletor global `button {}` | 4 telas antigas renderizam em roxo, nada sem estilo |
| 3 | `utils/`, `models/status.ts`, `models/roles.ts`, primitivos `ui/`, rota `/__ui` (dev) | kit contra o style-guide: raio 16, sombra, 48/56px, 8 status |
| 4 | `AuthLayout` + Login reescrita | `/login` contra o PDF; login real continua funcionando |
| 5 | Cadastro (7 cargos) + Recuperação 3 passos + modal | 5 telas de auth; colar código, Esc no modal |
| 6 | `AppLayout` + Sidebar + PageHeader + rotas novas | item ativo, logout; telas herdadas sem topbar duplicada |
| 7 | Gráficos validados no `/__ui` | raio/gap das barras, ângulos da pizza (82/10/8) |
| 8 | Mock + adaptadores + `useDashboard` + Dashboards | página inteira contra o PDF; derrubar `:3001` e não quebrar |
| 9 | Todas as F4's (DataTable + chips) e remoção da página antiga | contagens dos chips batendo; clique abre `/f4/:id` |
| 10 | **Detalhe da F4** com fluxo de 4 etapas, 4 abas e rail direito | contra `relatorio completo da f4.png` |
| 11 | Placeholders `/acessos` e `/fornecedores`, limpeza de CSS morto, breakpoints, a11y | `npm run build` limpo; 1280/1440/1920 |

## 7. Riscos

1. **`button {}` global** pinta todo `<button>` do app — neutralizar na Etapa 2 antes de introduzir `.btn`.
2. **`STATUSES` e `STATUS_CLASS`** estão hardcoded em `useDocuments.ts` e `DashboardPage.tsx`; apagar em conjunto na Etapa 9 ou o build quebra.
3. **Design é 1920px** e a sidebar medida tem ~390px (20% da tela) — usar `--sidebar-w: 300px` e largura fluida desde o começo, conferindo 1280/1440 nas Etapas 6 e 8.
4. **Glassmorphism**: `backdrop-filter` pesado em GPU integrada — prever fallback sólido via `@supports`.
5. **FAB do chatbot** cai sobre o card "Resultado das F4" e sobre a última coluna da tabela — reposicionar e dar `padding-bottom` ao main.
6. **`storage.getUser()`** devolve payload cacheado; ao adicionar `email` ao `User`, sessões antigas imprimem `undefined` — usar chaves `_v2` e um `toUser()` tolerante.
7. **`react-pdf`** importa CSS próprio dentro da página; a ordem pode inverter ao reestruturar — conferir o visualizador após cada etapa de CSS.
8. **`typescript: ^7.0.2`** no `package.json` é suspeito e `npm run build` roda `tsc --noEmit` — rodar o typecheck **antes** de começar, para separar erro novo de erro pré-existente.

## 8. Ainda em aberto

1. O design chama **"Em Análise"** um status que a mentoria não tem. Assumido como `IN_REWORK` (Em Alteração) — confirmar.
2. **Revisão Final do CVE**: a mentoria deixou duas opções (co-aprovação na técnica *ou* etapa final). Assumida a **etapa final**, atrás de um flag.
3. **CPSC** não tem posição no workflow (célula vazia na board) — entra como somente-leitura.
4. **RSPM e IST**: a tabela diz somente-leitura, uma anotação sugere que aprovam. Assumido somente-leitura, atrás de flag.
5. Anotação do designer sem resposta: *"qual o critério para mostrar a f4 aqui?"* (card "Precisa da sua atenção").
6. **Mobile** está no escopo da DEMO ou basta 1280–1920?
