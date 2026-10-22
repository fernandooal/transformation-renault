import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import { Icon } from "../icons";
import type { IconName } from "../icons";
import { cx } from "../../../utils/cx";
import { RISK_LABEL, RISK_TONE } from "../../../models/f4Assistant";
import type { AssistantInsight, AssistantReport } from "../../../models/f4Assistant";

export interface F4AssistantPanelProps {
  report: AssistantReport | null;
  thinking: boolean;
  /** Aplica o valor proposto no campo correspondente do formulário. */
  onApply: (field: string, value: string) => void;
}

const KIND_ICON: Record<AssistantInsight["kind"], IconName> = {
  risco: "alarm",
  precedente: "docsStack",
  sugestao: "check",
};

const KIND_LABEL: Record<AssistantInsight["kind"], string> = {
  risco: "Risco",
  precedente: "Precedente",
  sugestao: "Sugestão",
};

export default function F4AssistantPanel({ report, thinking, onApply }: F4AssistantPanelProps) {
  return (
    <aside className="assistant" aria-label="Assistente de preenchimento">
      <header className="assistant__head">
        <span className="assistant__title">
          <Icon name="chat" size={20} />
          Assistente de F4
        </span>
        <Badge tone="purple" size="sm">
          {report?.source === "modelo" ? "IA" : "IA · simulada"}
        </Badge>
      </header>

      <p className="assistant__intro">
        Compara o que você está preenchendo com o histórico de F4 e aponta o que costuma
        causar devolução.
      </p>

      {!report ? (
        <div className="u-stack" style={{ gap: "var(--space-3)" }}>
          <Skeleton height="72px" radius="var(--radius-md)" />
          <Skeleton height="96px" radius="var(--radius-md)" />
          <Skeleton height="96px" radius="var(--radius-md)" />
        </div>
      ) : (
        <>
          <div className={cx("assistant__gauge", `is-${report.level}`)}>
            <span className="assistant__score">{report.score}</span>
            <span className="assistant__gauge-labels">
              <Badge tone={RISK_TONE[report.level]} size="sm">
                {RISK_LABEL[report.level]}
              </Badge>
              <span className="assistant__headline">{report.headline}</span>
            </span>
          </div>

          <ul className="assistant__list">
            {report.insights.map((i) => (
              <li key={i.id} className={cx("insight", `insight--${i.kind}`)}>
                <span className="insight__head">
                  <span className="insight__icon">
                    <Icon name={KIND_ICON[i.kind]} size={16} strokeWidth={2.2} />
                  </span>
                  <span className="insight__kind">{KIND_LABEL[i.kind]}</span>
                  <strong className="insight__title">{i.title}</strong>
                </span>
                <p className="insight__body">{i.body}</p>
                <span className="insight__actions">
                  {i.suggestedValue && i.field && (
                    <Button size="sm" onClick={() => onApply(i.field!, i.suggestedValue!)}>
                      Aplicar
                    </Button>
                  )}
                  {i.sourceF4 && (
                    <Link to={`/f4/${i.sourceF4.id}`} className="insight__source">
                      ver {i.sourceF4.code}
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="assistant__foot" role="status">
        {thinking ? "Analisando o preenchimento…" : "Atualiza conforme você preenche."}
      </p>
    </aside>
  );
}
