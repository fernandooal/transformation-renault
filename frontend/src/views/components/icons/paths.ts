/**
 * Traçados dos ícones — grade 24×24, traço (não preenchimento).
 * SVG próprio em vez de biblioteca: os ícones de KPI do design são autorais
 * (pilha de documentos, vai-e-volta, relógio com seta, despertador) e nenhuma
 * lib os entrega iguais; misturar dois traços diferentes ficaria pior.
 */
export const ICON_PATHS = {
  // navegação
  grid: "M4 4h6v6H4zM14 4h6v4h-6zM14 12h6v8h-6zM4 14h6v6H4z",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5",
  users: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M17 4.2a3.5 3.5 0 0 1 0 6.6M22 20v-2a4 4 0 0 0-3-3.8",
  supplier: "M3 9h18M3 9l1.6-4.2A1.5 1.5 0 0 1 6 4h12a1.5 1.5 0 0 1 1.4 1L21 9M4.5 9v9A1.5 1.5 0 0 0 6 19.5h12A1.5 1.5 0 0 0 19.5 18V9M10 13h4",
  logout: "M15 17l5-5-5-5M20 12H9M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6",

  // ações
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16M21 21l-4.3-4.3",
  plus: "M12 5v14M5 12h14",
  close: "M6 6l12 12M18 6L6 18",
  check: "M4 12.5l5 5L20 6.5",
  chevronDown: "M6 9l6 6 6-6",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  eyeOff: "M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.4 5.3A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.2 6.6C3.6 8.4 2 12 2 12s3.6 7 10 7c1.4 0 2.6-.2 3.7-.6",
  attach: "M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8",
  send: "M21 3L10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8z",
  chat: "M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5",
  download: "M12 3v12M12 15l-4.5-4.5M12 15l4.5-4.5M4 19h16",
  calendar: "M7 3v4M17 3v4M4 9h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-13A1.5 1.5 0 0 1 5.5 5",

  // KPIs
  docsStack: "M8 3h7l4 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2M15 3v4h4M4 7v12a2 2 0 0 0 2 2h9M9.5 11h5M9.5 14.5h5",
  arrowsUpDown: "M7 21V4M7 4L3.5 7.5M7 4l3.5 3.5M17 3v17M17 20l3.5-3.5M17 20l-3.5-3.5",
  clockRotate: "M12 7v5l3.2 2M20 12a8 8 0 1 1-2.6-5.9M20 3v4h-4",
  alarm: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 9v4l2.6 1.6M5 2.5L2.2 5.2M19 2.5l2.8 2.7",
  returnArrow: "M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4",

  // fluxo da F4
  truck: "M3 7h10v9H3zM13 10h4l3 3v3h-7M6.5 19.5a1.8 1.8 0 1 0 0-3.5 1.8 1.8 0 0 0 0 3.5M17 19.5a1.8 1.8 0 1 0 0-3.5 1.8 1.8 0 0 0 0 3.5",
  pencil: "M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16zM14.5 5.5l4 4",
  cart: "M3 4h2.2l2.4 11h9.6l2.3-8H6M9.5 20a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6M17 20a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6",
  signature: "M3 17.5c3-6 5-6 6.5-3s3 3 4.5 0 3-4 4 .5M3 21h18",
  shield: "M12 3l7.5 3v5.5c0 4.6-3.1 7.9-7.5 9.5-4.4-1.6-7.5-4.9-7.5-9.5V6z",
  flag: "M5 21V4M5 4.8h11l-2 3.6 2 3.6H5",
} as const;

export type IconName = keyof typeof ICON_PATHS;

/** Ícones que precisam de fill em vez de stroke (nenhum por ora). */
export const FILLED_ICONS: IconName[] = [];
