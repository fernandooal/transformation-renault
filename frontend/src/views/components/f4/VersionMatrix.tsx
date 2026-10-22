import { Icon } from "../icons";
import { cx } from "../../../utils/cx";
import { valueTrend } from "../../../models/f4";
import type { F4Comparison } from "../../../models/f4";

/**
 * Matriz campo × versão.
 *
 * O design não usa diff lado a lado: cada campo é uma linha e cada versão uma
 * coluna, com a versão corrente destacada. A seta só aparece quando o valor
 * mudou em relação à versão imediatamente anterior.
 */
export default function VersionMatrix({ data }: { data: F4Comparison }) {
  const first = data.versions[0];
  const current = data.versions[data.currentIndex];

  return (
    <section className="vmatrix">
      <header className="vmatrix__head">
        <h3 className="vmatrix__title">Comparação com as versões anteriores</h3>
        <span className="vmatrix__meta">
          O que mudou da {first} para {current}
        </span>
      </header>

      <div className="table-wrap">
        <table className="vmatrix__table">
          <caption className="sr-only">
            Valores de cada campo da F4 em todas as versões, da {first} à {current}
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Campo</span>
              </th>
              {data.versions.map((v, i) => (
                <th
                  key={v}
                  scope="col"
                  className={cx("vmatrix__version", i === data.currentIndex && "is-current")}
                >
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="vmatrix__label">
                  {row.label}
                </th>
                {row.values.map((value, i) => {
                  const trend = valueTrend(value, row.values[i - 1]);
                  return (
                    <td key={data.versions[i]} className="vmatrix__value">
                      {value}
                      {trend && (
                        <span
                          className={cx("vmatrix__trend", `is-${trend}`)}
                          title={trend === "up" ? "aumentou" : "diminuiu"}
                        >
                          <Icon
                            name="chevronDown"
                            size={14}
                            strokeWidth={3}
                            style={trend === "up" ? { transform: "rotate(180deg)" } : undefined}
                          />
                          <span className="sr-only">
                            {trend === "up" ? "aumentou" : "diminuiu"} em relação à{" "}
                            {data.versions[i - 1]}
                          </span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
