import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import SearchInput from "./ui/SearchInput";
import { buttonClass } from "./ui/Button";

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  search?: { value: string; onChange: (v: string) => void; placeholder?: string };
  actions?: ReactNode;
  back?: { to: string; label?: string };
}

export default function PageHeader({ title, subtitle, search, actions, back }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__titles">
        {back && (
          <Link to={back.to} className={`${buttonClass("ghost", "sm")} page-header__back`}>
            ← {back.label ?? "Voltar"}
          </Link>
        )}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>

      {(search || actions) && (
        <div className="page-header__actions">
          {search && (
            <SearchInput
              value={search.value}
              onChange={search.onChange}
              placeholder={search.placeholder}
            />
          )}
          {actions}
        </div>
      )}
    </header>
  );
}
