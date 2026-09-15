import { Fragment } from "react";
import { Icon } from "../icons";
import type { IconName } from "../icons";
import Badge from "../ui/Badge";
import { cx } from "../../../utils/cx";
import type { F4Detail } from "../../../models/f4";
import type { Tone } from "../../../models/status";

/**
 * Quatro etapas, conforme a mentoria. O design desenhou três (Fornecedor →
 * PFE → Comprador); a Revisão Final do CVE entra aqui porque o cliente
 * definiu que a mentoria prevalece sobre o design.
 */
interface Stage {
  id: string;
  label: string;
  icon: IconName;
  /** A partir de quantas etapas concluídas esta já foi cumprida. */
  reachedAt: number;
}

const STAGES: Stage[] = [
  { id: "supplier", label: "Fornecedor", icon: "truck", reachedAt: 1 },
  { id: "technical", label: "Revisão Técnica", icon: "pencil", reachedAt: 2 },
  { id: "commercial", label: "Revisão Comercial", icon: "cart", reachedAt: 3 },
  { id: "final", label: "Revisão Final", icon: "signature", reachedAt: 4 },
];

function stageState(f4: F4Detail, stage: Stage): { person: string; label: string; tone: Tone } {
  if (stage.id === "supplier") {
    return { person: f4.supplier.name, label: `Enviou ${f4.version}`, tone: "green" };
  }
  const isCurrent = f4.stagesDone === stage.reachedAt;
  const done = f4.stagesDone > stage.reachedAt;
  const owner =
    stage.id === "technical"
      ? f4.responsible?.role === "PFE" || f4.responsible?.role === "CVE"
        ? f4.responsible.name
        : "—"
      : stage.id === "commercial"
        ? f4.responsible?.role === "BUYER" || f4.responsible?.role === "PPM"
          ? f4.responsible.name
          : "—"
        : f4.responsible?.role === "CVE"
          ? f4.responsible.name
          : "—";

  if (done) return { person: owner, label: "Concluída", tone: "green" };
  if (isCurrent) return { person: owner, label: "Em Análise", tone: "blue" };
  return { person: owner, label: "Aguardando", tone: "orange" };
}

export default function F4FlowStrip({ f4 }: { f4: F4Detail }) {
  return (
    <div className="flow">
      {STAGES.map((stage, i) => {
        const reached = f4.stagesDone >= stage.reachedAt;
        const state = stageState(f4, stage);
        return (
          <Fragment key={stage.id}>
            {i > 0 && (
              <span className={cx("flow__link", reached && "is-done")} aria-hidden="true" />
            )}
            <div className={cx("flow__stage", !reached && "flow__stage--pending")}>
              <span className="flow__icon">
                <Icon name={stage.icon} size={40} strokeWidth={1.6} />
              </span>
              <span className="flow__label">{stage.label}</span>
              <span className="flow__person">{state.person}</span>
              <Badge tone={state.tone} dot={state.tone === "blue"} size="sm">
                {state.label}
              </Badge>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
