import { useEffect, useState } from "react";
import * as SupplierService from "../services/supplier.service";
import type { SupplierReport } from "../models/supplier";

/** `/fornecedores/:id`. `notFound` separa "ainda carregando" de "não existe". */
export function useFornecedorDetalhe(id: string | undefined) {
  const [data, setData] = useState<SupplierReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    SupplierService.report(id)
      .then((d) => alive && setData(d))
      .catch((err: Error) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  return { data, loading, error, notFound: !loading && !error && data === null };
}
