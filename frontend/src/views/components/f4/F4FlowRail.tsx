import { Fragment } from "react";
import { Icon } from "../icons";
import type { IconName } from "../icons";
import Badge from "../ui/Badge";
import StatusBadge from "../ui/StatusBadge";
import { cx } from "../../../utils/cx";
import { returnsSummary } from "../../../models/f4";
import type { F4Detail } from "../../../models/f4";

/**
 * Rail vertical do fluxo da F4, dentro da aba.
 *
 * Substitui a faixa horizontal: o design novo move o fluxo para a coluna
 * direita e dá a cada etapa um ícone quadrado com cor própria. Os rótulos
 * entre as etapas são os checkpoints — o marco que fez o fluxo avançar.
 */
interface Stage {
  id: string;
  label: string;
  icon: IconName;
  /** Quantas etapas concluídas são necessárias para esta já ter sido atingida. */
  reachedAt: number;
  tone: string;
}

const STAGES: Stage[] = [
  { id: "supplier", label: "Fornecedor", icon: "truck", reachedAt: 1, tone: "supplier" },
  { id: "technical", label: "Revisão Técnica", icon: "wrench", reachedAt: 2, tone: "technical" },
  { id: "commercial", label: "Revisão Comercial", icon: "briefcase", reachedAt: 3, tone: "commercial" },
  { id: "final", label: "Revisão Final - CVE", icon: "userCheck", reachedAt: 4, tone: "final" },
];

function personFor(f4: F4Detail, stage: Stage): string {
  if (stage.id === "supplier") return f4.supplier.name;
  const role = f4.responsible?.role;
  if (stage.id === "technical" && (role === "PFE" || role === "IST")) return f4.responsible!.name;
  if (stage.id === "commercial" && (role === "BUYER" || role === "PPM" || role === "RSPM"))
    return f4.responsible!.name;
  if (stage.id === "final" && role === "CVE") return f4.responsible!.name;
  return "—";
}

/** Devoluções atribuídas à etapa, para o badge ↵N. */
function returnsFor(f4: F4Detail, stage: Stage): number {
  if (stage.id === "technical") return f4.technicalReturns;
  if (stage.id === "commercial") return f4.commercialReturns;
  return 0;
}

export default function F4FlowRail({ f4 }: { f4: F4Detail }) {
  return (
    <aside className="flow-rail" aria-label="Fluxo da F4">
      <header className="flow-rail__head">
        <h2 className="flow-rail__title">Fluxo da F4</h2>
        <StatusBadge status={f4.status} long size="sm" />
      </header>

      <Badge tone="purple" className="flow-rail__returns">
        {returnsSummary(f4)}
      </Badge>

      <ol className="flow-rail__stages">
        {STAGES.map((stage, i) => {
          const reached = f4.stagesDone >= stage.reachedAt;
          const voltas = returnsFor(f4, stage);
          const milestone = f4.checkpoints[i - 1];

          return (
            <Fragment key={stage.id}>
              {i > 0 && (
                <li className={cx("flow-rail__link", reached && "is-done")} aria-hidden="true">
                  <span className="flow-rail__rails" />
                  {milestone && <span className="flow-rail__milestone">{milestone.label}</span>}
                </li>
              )}
              <li className={cx("flow-rail__stage", !reached && "is-pending")}>
                {voltas > 0 && (
                  <span className="flow-rail__volta" title={`${voltas} devoluções nesta etapa`}>
                    <Icon name="returnArrow" size={12} strokeWidth={2.4} />
                    {voltas}
                  </span>
                )}
                <span className={`flow-rail__icon flow-rail__icon--${stage.tone}`}>
                  <Icon name={stage.icon} size={22} strokeWidth={1.8} />
                </span>
                <span className="flow-rail__labels">
                  <span className="flow-rail__stage-name">{stage.label}</span>
                  <span className="flow-rail__person">{personFor(f4, stage)}</span>
                </span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </aside>
  );
}
