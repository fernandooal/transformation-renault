import { Icon } from "../icons";

export interface StagePillsProps {
  /** Etapas concluídas. */
  done: number;
  total?: number;
  /** Nº de devoluções ("voltas"); some quando 0. */
  returns?: number;
}

export default function StagePills({ done, total = 4, returns = 0 }: StagePillsProps) {
  return (
    <span
      className="stage-pills"
      aria-label={`${done} de ${total} etapas${returns ? `, ${returns} voltas` : ""}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i < done ? "stage-pills__pill is-done" : "stage-pills__pill"}
        />
      ))}
      {returns > 0 && (
        <span className="stage-pills__returns" aria-hidden="true">
          <Icon name="returnArrow" size={14} strokeWidth={2} />
          {returns}
        </span>
      )}
    </span>
  );
}
