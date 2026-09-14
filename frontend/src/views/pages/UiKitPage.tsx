import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  CodeInput,
  DataTable,
  EmptyState,
  FilterChips,
  GlassCard,
  KpiCard,
  Modal,
  PasswordField,
  SearchInput,
  SectionTitle,
  Select,
  Skeleton,
  StagePills,
  StatusBadge,
  Tabs,
  TextField,
} from "../components/ui";
import type { Column } from "../components/ui";
import { Icon, ICON_PATHS } from "../components/icons";
import { PieChart, StackedBarChart } from "../components/charts";
import type { IconName } from "../components/icons";
import { F4_STATUSES } from "../../models/status";
import { ROLE_OPTIONS } from "../../models/roles";
import { decimal, int, partNumber, percent, signed } from "../../utils/format";
import { greeting, relativeTime } from "../../utils/datetime";

/** Rota /__ui, só em desenvolvimento. Serve para comparar com o style-guide. */

interface DemoRow {
  id: number;
  part: string;
  code: string;
  pn: string;
  done: number;
  returns: number;
}

const ROWS: DemoRow[] = [
  { id: 1, part: "Disco de freio dianteiro", code: "F4 2024 - 0847 • v3", pn: "7701208466", done: 2, returns: 3 },
  { id: 2, part: "Suporte do coletor de admissão", code: "F4 2024 - 0851 • v1", pn: "8200934112", done: 2, returns: 0 },
  { id: 3, part: "Chicote elétrico da porta", code: "F4 2024 - 0839 • v2", pn: "7711636988", done: 3, returns: 2 },
];

const COLUMNS: Array<Column<DemoRow>> = [
  {
    key: "part",
    header: "F4 / Peça",
    render: (r) => (
      <span className="cell-primary">
        <span className="cell-primary__title">{r.part}</span>
        <span className="cell-primary__meta">{r.code}</span>
      </span>
    ),
  },
  { key: "pn", header: "Part Number", align: "center", render: (r) => partNumber(r.pn) },
  {
    key: "supplier",
    header: "Fornecedor",
    render: () => (
      <span className="cell-person">
        <Avatar name="M. Andrade" size={32} />
        M. Andrade
      </span>
    ),
  },
  {
    key: "flow",
    header: "Fluxo / Voltas",
    align: "center",
    render: (r) => <StagePills done={r.done} returns={r.returns} />,
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: () => <StatusBadge status="TECH_REVIEW" />,
  },
  {
    key: "updated",
    header: "Atualizado",
    align: "center",
    render: () => relativeTime(new Date(Date.now() - 2 * 864e5).toISOString()),
  },
];

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card title={title}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        {children}
      </div>
    </Card>
  );
}

export default function UiKitPage() {
  const [text, setText] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("");
  const [checked, setChecked] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("todas");
  const [code, setCode] = useState("179");
  const [tab, setTab] = useState("hist");
  const [modal, setModal] = useState(false);

  return (
    <div style={{ padding: 48, display: "grid", gap: 24, maxWidth: 1360, margin: "0 auto" }}>
      <SectionTitle>Kit de UI — RGdB</SectionTitle>
      <p className="muted">
        {greeting()}. Referência viva dos primitivos. Compare com <code>design/style-guide/</code>.
      </p>

      <Row title="Botões">
        <Button variant="primary">Primário</Button>
        <Button variant="primary" icon={<Icon name="plus" size={18} />}>Nova F4</Button>
        <Button variant="outline" icon={<Icon name="returnArrow" size={18} />}>Devolver para a Revisão</Button>
        <Button variant="primary" icon={<Icon name="pencil" size={18} />}>Aprovar e Assinar</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Esqueci minha senha</Button>
        <Button disabled>Desabilitado</Button>
        <Button size="sm">Pequeno</Button>
        <Button size="lg">Grande</Button>
      </Row>

      <Row title="Badges de status (8 status da mentoria)">
        {F4_STATUSES.map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
        <Badge tone="purple" className="badge-pill--role">PFE</Badge>
        <Badge tone="green">Enviou V3</Badge>
      </Row>

      <Row title="Pílulas de fluxo e avatares">
        <StagePills done={2} returns={3} />
        <StagePills done={3} returns={0} />
        <StagePills done={4} />
        <Avatar size={24} />
        <Avatar size={32} />
        <Avatar size={40} />
      </Row>

      <Card title="Campos (pele clara)">
        <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
          <TextField label="Nome" value={text} onChange={setText} required />
          <TextField label="Com erro" value="" onChange={() => {}} error="Campo obrigatório" />
          <PasswordField label="Senha" value={pass} onChange={setPass} required />
          <Select
            label="Tipo de usuário"
            value={role}
            onChange={setRole}
            options={ROLE_OPTIONS}
            placeholder="Selecione o tipo de usuário"
          />
          <Checkbox label="Lembre de mim" checked={checked} onChange={setChecked} />
          <SearchInput value={query} onChange={setQuery} />
        </div>
      </Card>

      <div style={{ background: "var(--color-bg-auth)", padding: 40, borderRadius: 16 }}>
        <GlassCard title="Seja Bem-Vindo!">
          <TextField label="E-mail" value={text} onChange={setText} tone="onDark" variant="inField" required />
          <PasswordField label="Senha" value={pass} onChange={setPass} tone="onDark" variant="inField" required />
          <Checkbox label="Lembre de mim" checked={checked} onChange={setChecked} tone="onDark" />
          <Button variant="onDark" size="lg" block>Entrar</Button>
          <CodeInput value={code} onChange={setCode} />
        </GlassCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        <KpiCard label="F4's Ativas" value={int(23)} icon={<Icon name="docsStack" size={56} strokeWidth={1.5} />} hint={`${signed(3)} essa semana`} hintTone="positive" />
        <KpiCard label="Em vai e volta" value={int(7)} icon={<Icon name="arrowsUpDown" size={56} strokeWidth={1.5} />} hint={`média de ${decimal(3.4)} voltas`} />
        <KpiCard label="Ciclo médio (dias)" value={decimal(6.2)} icon={<Icon name="clockRotate" size={56} strokeWidth={1.5} />} hint={`${signed(-1.8, "dia vc. mês anterior", 1)}`} />
        <KpiCard label="Taxa de Aprovação" value={percent(23)} hint={`${signed(6, "p.p.")}`} hintTone="positive" />
      </div>

      <FilterChips
        items={[
          { id: "todas", label: "Todas", count: 23 },
          { id: "revisao", label: "Em Revisão", count: 7 },
          { id: "alteracao", label: "Em Alteração", count: 9 },
          { id: "aprovadas", label: "Aprovadas", count: 5 },
          { id: "reprovadas", label: "Reprovadas", count: 2 },
        ]}
        value={filter}
        onChange={setFilter}
      />

      <Card padding="none">
        <DataTable columns={COLUMNS} rows={ROWS} getRowKey={(r) => r.id} onRowClick={() => {}} />
      </Card>

      <Tabs
        items={[
          { id: "hist", label: "Histórico e Comentários" },
          { id: "vers", label: "Comparar Versões" },
          { id: "check", label: "Checkpoints" },
          { id: "docs", label: "Documentos e Assinaturas" },
        ]}
        value={tab}
        onChange={setTab}
      >
        <EmptyState title="Aba em construção" description={`Painel ativo: ${tab}`} />
      </Tabs>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card
          title="Onde as F4 estão paradas"
          footer="A maior fila está no PFE - e boa parte é reincidência de devolução. É exatamente o gargalo que o histórico por F4 ajuda a encurtar."
        >
          <StackedBarChart
            caption="Filas de F4 por etapa do fluxo"
            categories={[
              { label: "Forn.", values: { analise: 4, devolvida: 0, aprovada: 0 } },
              { label: "PFE", values: { analise: 3, devolvida: 6, aprovada: 0 } },
              { label: "Compr.", values: { analise: 2, devolvida: 4, aprovada: 0 } },
              { label: "Aprov.", values: { analise: 0, devolvida: 0, aprovada: 3 } },
            ]}
            series={[
              { key: "analise", label: "Em análise", color: "var(--c-purple-300)" },
              { key: "devolvida", label: "Devolvida", color: "var(--c-blue-400)" },
              { key: "aprovada", label: "Aprovada", color: "var(--c-teal-300)" },
            ]}
          />
        </Card>

        <Card title="Resultado das F4">
          <PieChart
            caption="Distribuição das F4 por resultado"
            slices={[
              { id: "aprovadas", label: "Aprovadas", value: 82, color: "var(--c-green-500)" },
              { id: "andamento", label: "Em andamento", value: 10, color: "var(--c-blue-600)" },
              { id: "reprovadas", label: "Reprovadas", value: 8, color: "var(--c-orange-500)" },
            ]}
          />
        </Card>
      </div>

      <Card
        title="Voltas por mês"
        corner="técnicas vs. comerciais"
        footer="Tendência de queda desde a adoção do ambiente por F4 e dos checkpoints."
      >
        <StackedBarChart
          caption="Devoluções por mês, técnicas e comerciais"
          categories={[
            { label: "Mar", values: { tecnica: 7, comercial: 5 } },
            { label: "Abr", values: { tecnica: 9, comercial: 6 } },
            { label: "Mai", values: { tecnica: 8, comercial: 4 } },
            { label: "Jun", values: { tecnica: 5, comercial: 3 } },
            { label: "Jul", values: { tecnica: 4, comercial: 2 } },
            { label: "Ago", values: { tecnica: 3, comercial: 2 } },
          ]}
          series={[
            { key: "tecnica", label: "Devolução técnica", color: "var(--c-orange-600)" },
            { key: "comercial", label: "Devolução comercial", color: "var(--c-orange-300)" },
          ]}
        />
      </Card>

      <Row title="Esqueleto e modal">
        <div style={{ display: "grid", gap: 8, width: 240 }}>
          <Skeleton height="20px" />
          <Skeleton height="44px" />
        </div>
        <Button onClick={() => setModal(true)}>Abrir modal</Button>
      </Row>

      <Card title={`Ícones (${Object.keys(ICON_PATHS).length})`}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {(Object.keys(ICON_PATHS) as IconName[]).map((n) => (
            <span key={n} style={{ display: "grid", justifyItems: "center", gap: 6, width: 92 }}>
              <Icon name={n} size={26} />
              <span className="small muted">{n}</span>
            </span>
          ))}
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Senha alterada">
        <Icon name="check" size={64} strokeWidth={3} style={{ color: "var(--c-green-500)" }} />
        <h2 className="modal__title">Senha Alterada com Sucesso!</h2>
        <p className="muted">Retorne para o login</p>
        <Button onClick={() => setModal(false)}>Ok</Button>
      </Modal>
    </div>
  );
}
