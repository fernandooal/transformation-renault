import Card from "../ui/Card";
import type { F4Detail } from "../../../models/f4";

/**
 * "Continuidade Garantida" — o argumento de venda do produto: o histórico vive
 * no ambiente da F4, então a troca de responsável não perde contexto.
 */
export default function ContinuityCard({ f4 }: { f4: F4Detail }) {
  const responsible = f4.responsible?.name.split(" ")[0] ?? "o responsável";
  const items = [
    { value: f4.history.length, label: "Eventos", color: "var(--color-primary)" },
    { value: f4.returns, label: "Voltas", color: "var(--c-orange-500)" },
    { value: f4.checkpoints.filter((c) => c.done).length, label: "Checkpoints", color: "var(--c-purple-900)" },
  ];

  return (
    <Card title="Continuidade Garantida">
      <p className="small muted" style={{ lineHeight: 1.5 }}>
        Todo o histórico fica registrado no ambiente da F4. Se {responsible} entrar de
        férias, qualquer colega autorizado retoma exatamente de onde parou — sem depender
        de e-mails soltos.
      </p>
      <div className="continuity">
        {items.map((item) => (
          <span key={item.label} className="continuity__item" style={{ background: item.color }}>
            <span className="continuity__value">{item.value}</span>
            <span className="continuity__label">{item.label}</span>
          </span>
        ))}
      </div>
    </Card>
  );
}
