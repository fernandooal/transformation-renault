import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Badge, Button, Card, EmptyState, Skeleton, StatusBadge, Tabs } from "../components/ui";
import { Icon } from "../components/icons";
import F4FlowStrip from "../components/f4/F4FlowStrip";
import PartiesCard from "../components/f4/PartiesCard";
import ContinuityCard from "../components/f4/ContinuityCard";
import HistoryTimeline from "../components/f4/HistoryTimeline";
import CommentComposer from "../components/f4/CommentComposer";
import { useF4Detail } from "../../controllers/useF4Detail";
import type { DetailTab } from "../../controllers/useF4Detail";
import { returnsSummary } from "../../models/f4";
import { partNumber } from "../../utils/format";
import { relativeTime } from "../../utils/datetime";

const TABS = [
  { id: "historico", label: "Histórico e Comentários" },
  { id: "versoes", label: "Comparar Versões" },
  { id: "checkpoints", label: "Checkpoints" },
  { id: "documentos", label: "Documentos e Assinaturas" },
];

export default function F4DetailPage() {
  const { id } = useParams<{ id: string }>();
  const s = useF4Detail(Number(id));

  if (s.loading) {
    return (
      <>
        <Skeleton height="40px" width="45%" />
        <Skeleton height="200px" />
        <Skeleton height="320px" />
      </>
    );
  }

  if (!s.f4) {
    return (
      <>
        <PageHeader title="F4 não encontrada" back={{ to: "/f4", label: "Voltar para F4s" }} />
        <Card padding="none">
          <EmptyState title="Essa F4 não existe" description={s.error ?? undefined} />
        </Card>
      </>
    );
  }

  const f4 = s.f4;

  return (
    <>
      <PageHeader
        title={f4.part}
        back={{ to: "/f4", label: "Voltar para F4s" }}
        actions={
          <>
            <Button
              variant="outline"
              icon={<Icon name="returnArrow" size={18} />}
              onClick={s.returnToSupplier}
            >
              Devolver para a Revisão
            </Button>
            <Button icon={<Icon name="pencil" size={18} />} onClick={s.approveAndSign}>
              Aprovar e Assinar
            </Button>
          </>
        }
      />

      <p className="detail-meta">
        {f4.code} • PN {partNumber(f4.partNumber)} • VERSÃO ATUAL {f4.version.toUpperCase()} •{" "}
        {f4.supplier.name.toUpperCase()} • {f4.project.toUpperCase()}
      </p>

      {s.notice && (
        <p className="notice" role="status">
          {s.notice}{" "}
          <Button variant="link" onClick={s.dismissNotice}>
            ok
          </Button>
        </p>
      )}

      <div className="u-row" style={{ gap: "var(--space-4)" }}>
        <h2 className="page-header__title" style={{ fontSize: "var(--text-xl)" }}>
          Fluxo da F4
        </h2>
        <Badge tone="purple">{returnsSummary(f4)}</Badge>
        <StatusBadge status={f4.status} long />
      </div>

      <F4FlowStrip f4={f4} />

      <div className="detail-grid">
        <Tabs
          items={TABS}
          value={s.tab}
          onChange={(t) => s.setTab(t as DetailTab)}
          label="Seções da F4"
        >
          {s.tab === "historico" && (
            <>
              <HistoryTimeline entries={f4.history} />
              <CommentComposer onComment={s.comment} onCheckpoint={s.checkpoint} />
            </>
          )}

          {s.tab === "versoes" && (
            <EmptyState
              title="Comparação de versões"
              description={`Esta F4 está na ${f4.version}. O diff campo a campo entre versões depende do histórico de alterações, que o backend ainda não expõe.`}
            />
          )}

          {s.tab === "checkpoints" && (
            <ul className="checkpoints">
              {f4.checkpoints.map((c) => (
                <li key={c.id} className="checkpoint">
                  <span className={c.done ? "checkpoint__mark is-done" : "checkpoint__mark"}>
                    <Icon name={c.done ? "check" : "flag"} size={18} strokeWidth={2.4} />
                  </span>
                  <span>
                    <span className="checkpoint__label">{c.label}</span>
                    <br />
                    <span className="checkpoint__meta">
                      {c.done && c.at ? `${relativeTime(c.at)} · ${c.by}` : "Pendente"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {s.tab === "documentos" && (
            <EmptyState
              title="Documentos e Assinaturas"
              description="A assinatura digital ICP-Brasil está mockada nesta fase: o botão 'Aprovar e Assinar' registra o evento no histórico, sem certificado real."
            />
          )}
        </Tabs>

        <div className="u-stack" style={{ gap: "var(--space-6)" }}>
          <PartiesCard parties={f4.parties} />
          <ContinuityCard f4={f4} />
        </div>
      </div>
    </>
  );
}
