import { percent } from "../../../utils/format";
import type { SupplierOutcome } from "../../../models/supplier";

export interface OutcomeBarProps {
  outcome: SupplierOutcome;
  /** Entra no rótulo acessível: "...nos Últimos 12 meses". */
  period?: string;
}

const SEGMENTS = [
  { key: "aprovadas", label: "aprovadas" },
  { key: "reprovadas", label: "reprovadas" },
  { key: "andamento", label: "em andamento" },
] as const;

/**
 * Barra empilhada "Distribuição de resultado".
 *
 * Verde / vermelho / azul distinguem os três resultados só pela cor, então a
 * barra carrega `role="img"` com os percentuais escritos no `aria-label` —
 * sem isso a informação não chega a quem não vê a cor.
 */
export default function OutcomeBar({ outcome, period }: OutcomeBarProps) {
  const parts = SEGMENTS.map((s) => `${percent(outcome[s.key])} ${s.label}`).join(", ");
  const suffix = period ? `, ${period.toLowerCase()}` : "";

  return (
    <div
      className="outcome-bar"
      role="img"
      aria-label={`Distribuição de resultado${suffix}: ${parts}.`}
    >
      {SEGMENTS.map((s) => (
        <span
          key={s.key}
          className={`outcome-bar__seg outcome-bar__seg--${s.key}`}
          style={{ flexGrow: outcome[s.key] }}
        />
      ))}
    </div>
  );
}
