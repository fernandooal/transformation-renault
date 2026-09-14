import { Link } from "react-router-dom";
import { useF4Form } from "../../controllers/useF4Form";
import { SECTIONS, SET_ROWS, fmt, num, slug, str } from "../../models/f4Form";
import F4Field from "../components/F4Field";
import { Button, buttonClass } from "../components/ui";
import PageHeader from "../components/PageHeader";

export default function NewF4Page() {
  const { form, setField, setTotal, totalImpact, unitImpact, error, saving, submit, fillWithAI } =
    useF4Form();

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

      <div className="form-page">
        <p className="muted small">
          RPIFDASIA20170007 — V251028 · RENAULT — CONFIDENTIAL C
        </p>
        {error && <p className="error">{error}</p>}

        <form onSubmit={submit}>
          {SECTIONS.map((section) => (
            <fieldset key={section.title}>
              <legend>{section.title}</legend>
              <div className="field-grid">
                {section.fields.map((field) => (
                  <F4Field key={field.name} field={field} form={form} onChange={setField} />
                ))}
              </div>
            </fieldset>
          ))}

          <fieldset>
            <legend>SET Gap Costbreakdown (pág. 2)</legend>
            <table className="set-table">
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
                          value={str(form[`${key}_qty`])}
                          onChange={(e) => setField(`${key}_qty`, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.001"
                          value={str(form[`${key}_unit`])}
                          onChange={(e) => setField(`${key}_unit`, e.target.value)}
                        />
                      </td>
                      <td className="total-cell">{fmt(total)}</td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td colSpan={3}>TOTAL SET Amount Without Financial Fees (Automatic)</td>
                  <td className="total-cell">{fmt(setTotal)}</td>
                </tr>
              </tbody>
            </table>
          </fieldset>

          <fieldset>
            <legend>Total Impact</legend>
            <div className="field-grid">
              <label className="field" htmlFor="annualVolume">
                <span>
                  Average Full Year volume of units (12 months) — {str(form.units) || "Part"}/year
                </span>
                <input
                  id="annualVolume"
                  type="number"
                  value={str(form.annualVolume)}
                  onChange={(e) => setField("annualVolume", e.target.value)}
                />
              </label>
              <label className="field">
                <span>Total impact — {str(form.offerCurrency) || "EUR"}</span>
                <input readOnly value={fmt(totalImpact)} />
              </label>
              <label className="field">
                <span>
                  Unit impact w/o SET, for information only — {str(form.offerCurrency) || "EUR"}/
                  {str(form.units) || "Part"}
                </span>
                <input readOnly value={fmt(unitImpact)} />
              </label>
            </div>
          </fieldset>

          <div className="form-actions">
            <Link to="/" className={buttonClass("ghost")}>
              Cancelar
            </Link>
            <Button type="submit" loading={saving}>
              {saving ? "Salvando..." : "Criar F4"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
