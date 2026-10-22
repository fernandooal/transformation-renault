import { Fragment } from "react";
import { Link } from "react-router-dom";

export interface Crumb {
  label: string;
  to?: string;
}

/**
 * Trilha de navegação. O último item é o atual e não vira link.
 * Substitui as duas versões que nasceram em paralelo (projeto e fornecedor).
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Você está em">
      <ol className="crumbs__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item.label}>
              <li className="crumbs__item">
                {item.to && !last ? (
                  <Link to={item.to} className="crumbs__link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="crumbs__current" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
              {!last && (
                <li className="crumbs__sep" aria-hidden="true">
                  ›
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
