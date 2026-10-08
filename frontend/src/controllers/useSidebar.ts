import { useEffect, useState } from "react";

const KEY = "rtd_sidebar_collapsed";

/** Estado de colapso da sidebar. Preferência por viewer, então localStorage. */
export function useSidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, collapsed ? "1" : "0");
    } catch {
      /* modo privado: a preferência vive só nesta sessão */
    }
  }, [collapsed]);

  return { collapsed, toggle: () => setCollapsed((c) => !c) };
}
