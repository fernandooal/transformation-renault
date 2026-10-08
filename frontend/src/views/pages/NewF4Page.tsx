import { Link } from "react-router-dom";
import { useF4Form } from "../../controllers/useF4Form";
import { useF4Assistant } from "../../controllers/useF4Assistant";
import { SECTIONS, SET_ROWS, fmt, num, slug, str } from "../../models/f4Form";
import F4Field from "../components/F4Field";
import F4AssistantPanel from "../components/f4/F4AssistantPanel";
import { Button, Card, buttonClass } from "../components/ui";
import PageHeader from "../components/PageHeader";

export default function NewF4Page() {
  const { form, setField, setTotal, totalImpact, unitImpact, error, saving, submit, fillWithAI } =
    useF4Form();

  const assistant = useF4Assistant(form, totalImpact);

  const currency = str(form.offerCurrency) || "EUR";
  const units = str(form.units) || "Part";

  return (
    <>
      <PageHeader
        title="Nova F4"
        subtitle="F4 sheet — Cost of Modification"
        back={{ to: "/f4", label: "Voltar" }}
        actions={
          <Button type="button" variant="ghost" onClick={fillWithAI}>
            Preencher com IA
          </Button>
        }
      />

      <div className="f4-layout">
        <div className="f4-page">
        <p className="muted small">RPIFDASIA20170007 — V251028 · RENAULT — CONFIDENTIAL C</p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <form className="f4-form" onSubmit={submit}>
          {SECTIONS.map((section) => (
            <Card key={section.title} title={section.title}>
              <div className="f4-grid">
                {section.fields.map((field) => (
                  <F4Field key={field.name} field={field} form={form} onChange={setField} />
                ))}
              </div>
            </Card>
          ))}

          <Card title="SET Gap Costbreakdown (pág. 2)">
            <div className="table-wrap">
              <table className="f4-set-table">
                <thead>
                  <tr>
                    <th>Sections</th>
                    <th>Quantity</th>
                    <th>Unit cost</th>
                    <th>TOTAL (Automatic)</th>
                  </tr>
                </thead>
                <tbody>
                  {SET_ROWS.map((row) => {
                    const key = slug(row);
                    const total = num(form[`${key}_qty`]) * num(form[`${key}_unit`]);
                    return (
                      <tr key={row}>
                        <td>{row}</td>
                        <td>
                          <input
                            type="number"
                            className="f4-set-input"
                            aria-label={`${row} — quantity`}
                            value={str(form[`${key}_qty`])}
                            onChange={(e) => setField(`${key}_qty`, e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="f4-set-input"
                            step="0.001"
                            aria-label={`${row} — unit cost`}
                            value={str(form[`${key}_unit`])}
                            onChange={(e) => setField(`${key}_unit`, e.target.value)}
                          />
                        </td>
                        <td className="f4-total-cell">{fmt(total)}</td>
                      </tr>
                    );
                  })}
                  <tr className="f4-total-row">
                    <td colSpan={3}>TOTAL SET Amount Without Financial Fees (Automatic)</td>
                    <td className="f4-total-cell">{fmt(setTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Total Impact">
            <div className="f4-grid">
              <label className="f4-field" htmlFor="annualVolume">
                <span className="f4-field__label">
                  Average Full Year volume of units (12 months) — {units}/year
                </span>
                <input
                  id="annualVolume"
                  type="number"
                  className="f4-control"
                  value={str(form.annualVolume)}
                  onChange={(e) => setField("annualVolume", e.target.value)}
                />
              </label>

              {/* Somente-leitura: par rótulo/valor da aba "Comparar Versões". */}
              <div className="f4-field f4-readout">
                <span className="f4-readout__label">Total impact — {currency}</span>
                <span className="f4-readout__value">{fmt(totalImpact)}</span>
              </div>

              <div className="f4-field f4-readout">
                <span className="f4-readout__label">
                  Unit impact w/o SET, for information only — {currency}/{units}
                </span>
                <span className="f4-readout__value">{fmt(unitImpact)}</span>
              </div>
            </div>
          </Card>

          <div className="f4-actions">
            <Link to="/" className={buttonClass("ghost")}>
              Cancelar
            </Link>
            <Button type="submit" loading={saving}>
              {saving ? "Salvando..." : "Criar F4"}
            </Button>
          </div>
        </form>
        </div>

        <F4AssistantPanel
          report={assistant.report}
          thinking={assistant.thinking}
          onApply={(field, value) => setField(field, value)}
        />
      </div>
    </>
  );
}
