import type { ReactNode } from "react";

export interface GlassCardProps {
  title?: ReactNode;
  children: ReactNode;
}

export default function GlassCard({ title, children }: GlassCardProps) {
  return (
    <section className="glass-card">
      {title && <h1 className="glass-card__title">{title}</h1>}
      {children}
    </section>
  );
}
