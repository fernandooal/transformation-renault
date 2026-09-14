import type { ChartCategory, ChartSeries } from "./types";

/**
 * Tabela sr-only com os números do gráfico.
 *
 * Não é enfeite: as cores do style-guide (#66D8D0, #F0A868, #4B9AF6) ficam
 * abaixo de 3:1 contra o card branco. Como são cores de marca e não podem
 * mudar, a leitura fica garantida pela legenda visível e por esta tabela.
 */
export default function DataTableFallback({
  caption,
  categories,
  series,
}: {
  caption: string;
  categories: ChartCategory[];
  series: ChartSeries[];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Etapa</th>
          {series.map((s) => (
            <th key={s.key} scope="col">
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categories.map((c) => (
          <tr key={c.label}>
            <th scope="row">{c.label}</th>
            {series.map((s) => (
              <td key={s.key}>{c.values[s.key] ?? 0}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
