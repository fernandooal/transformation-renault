import { useEffect, useState } from "react";
import * as SupplierService from "../services/supplier.service";
import type { SupplierSummary } from "../models/supplier";

/** Grid `/fornecedores`: a lista inteira, sem busca nem filtro (não há no design). */
export function useFornecedores() {
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    SupplierService.list()
      .then((d) => alive && setSuppliers(d))
      .catch((err: Error) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { suppliers, loading, error };
}
