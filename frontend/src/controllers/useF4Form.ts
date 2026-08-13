import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as DocumentService from "../services/document.service";
import {
  AI_SUGGESTIONS,
  IMPACT_FIELDS,
  SET_ROWS,
  num,
  slug,
  type FormState,
} from "../models/f4Form";

export function useF4Form() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ offerCurrency: "EUR", units: "Part" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setField = (name: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [name]: value }));

  const setTotal = useMemo(
    () =>
      SET_ROWS.reduce(
        (sum, row) => sum + num(form[`${slug(row)}_qty`]) * num(form[`${slug(row)}_unit`]),
        0
      ),
    [form]
  );

  const totalImpact = IMPACT_FIELDS.reduce((sum, name) => sum + num(form[name]), 0);
  const unitImpact = num(form.annualVolume) ? totalImpact / num(form.annualVolume) : 0;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await DocumentService.create({ ...form, setTotal, totalImpact, unitImpact });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
      setSaving(false);
    }
  }

  // Preenchimento assistido por IA — mock: sugere valores a partir de F4s anteriores.
  function fillWithAI() {
    setForm((f) => {
      const filled = { ...f };
      for (const [name, value] of Object.entries(AI_SUGGESTIONS)) {
        if (!filled[name]) filled[name] = value;
      }
      return filled;
    });
  }

  return { form, setField, setTotal, totalImpact, unitImpact, error, saving, submit, fillWithAI };
}
