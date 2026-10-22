import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Button, Card, EmptyState, Skeleton, Tabs } from "../components/ui";
import { Icon } from "../components/icons";
import F4FlowRail from "../components/f4/F4FlowRail";
import VersionMatrix from "../components/f4/VersionMatrix";
import HistoryTimeline from "../components/f4/HistoryTimeline";
import CommentComposer from "../components/f4/CommentComposer";
import DocumentsPanel from "../components/f4/DocumentsPanel";
import { useF4Detail } from "../../controllers/useF4Detail";
import type { DetailTab } from "../../controllers/useF4Detail";
import { partNumber } from "../../utils/format";

const TABS = [
  { id: "historico", label: "Histórico e Comentários" },
  { id: "versoes", label: "Comparar Versões" },
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
          // Aprovada é estado terminal: não há mais o que devolver nem assinar.
          // O que resta é emitir o documento — ainda sem geração por trás.
          f4.status === "APPROVED" ? (
            <Button icon={<Icon name="docsStack" size={18} />}>Gerar F4</Button>
          ) : (
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
          )
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

      <Tabs
        items={TABS}
        value={s.tab}
        onChange={(t) => s.setTab(t as DetailTab)}
        label="Seções da F4"
      >
          {s.tab === "historico" && (
            <div className="tab-split">
              <div>
                <HistoryTimeline entries={f4.history} />
                <CommentComposer onComment={s.comment} />
              </div>
              <F4FlowRail f4={f4} />
            </div>
          )}

          {s.tab === "versoes" &&
            (s.comparison ? (
              <VersionMatrix data={s.comparison} />
            ) : (
              <EmptyState
                title="Comparação de versões"
                description="Esta F4 ainda não tem versões anteriores para comparar."
              />
            ))}

          {s.tab === "documentos" && (
            <DocumentsPanel
              documents={f4.documents}
              currentUser={s.currentUser}
              onSign={s.sign}
            />
          )}
      </Tabs>
    </>
  );
}
