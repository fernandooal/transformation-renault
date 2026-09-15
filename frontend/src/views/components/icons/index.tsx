import type { SVGProps } from "react";
import { ICON_PATHS } from "./paths";
import type { IconName } from "./paths";

export type { IconName };
export { ICON_PATHS };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  /** Espessura do traço. O design usa ~1.75 na navegação e 1.5 nos KPIs grandes. */
  strokeWidth?: number;
  /** Rótulo acessível. Sem ele o ícone é decorativo (aria-hidden). */
  title?: string;
}

export function Icon({ name, size = 20, strokeWidth = 1.75, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/** Silhueta de usuário usada como fallback do Avatar (é preenchida, não traçada). */
export function UserGlyph({ size = 40, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <circle cx="20" cy="20" r="20" fill="var(--c-gray-200)" />
      <circle cx="20" cy="16" r="6.5" fill="var(--c-white)" />
      <path d="M7.5 35a12.5 12.5 0 0 1 25 0z" fill="var(--c-white)" />
    </svg>
  );
}
