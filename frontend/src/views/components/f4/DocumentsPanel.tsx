import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { buttonClass } from "../ui/Button";
import { Icon } from "../icons";
import SignatureList from "./SignatureList";
import { documentState, signatureProgress } from "../../../models/f4";
import { relativeTime } from "../../../utils/datetime";
import type { F4DocumentFile, Person } from "../../../models/f4";

export interface DocumentsPanelProps {
  documents: F4DocumentFile[];
  currentUser: Person;
  onSign: (documentId: string) => void;
}

const KB = (n: number): string => (n >= 1024 ? `${(n / 1024).toFixed(1)} MB` : `${n} KB`);

export default function DocumentsPanel({ documents, currentUser, onSign }: DocumentsPanelProps) {
  const progress = signatureProgress(documents);
  const pct = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100);

  return (
    <div className="u-stack" style={{ gap: "var(--space-6)" }}>
      <div className="sign-progress">
        <div className="sign-progress__head">
          <span className="sign-progress__title">Assinaturas</span>
          <span className="sign-progress__count">
            {progress.done} de {progress.total} concluídas
          </span>
        </div>
        <div className="sign-progress__track">
          <span className="sign-progress__bar" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {documents.map((doc) => {
        const state = documentState(doc);
        const myTurn = state.next?.signer.id === currentUser.id;

        return (
          <article key={doc.id} className="doc-card">
            <header className="doc-card__head">
              <span className="doc-card__icon">
                <Icon name="docsStack" size={24} />
              </span>
              <span className="doc-card__titles">
                <span className="doc-card__name">{doc.name}</span>
                <span className="doc-card__meta">
                  {doc.version.toUpperCase()} • {KB(doc.sizeKb)} • adicionado{" "}
                  {relativeTime(doc.addedAt).toLowerCase()}
                </span>
              </span>
              {!doc.requiresSignature ? (
                <Badge tone="neutral" size="sm">
                  Sem assinatura
                </Badge>
              ) : state.complete ? (
                <Badge tone="green" size="sm">
                  Assinado
                </Badge>
              ) : (
                <Badge tone="orange" size="sm">
                  {state.signed} de {state.total} assinaturas
                </Badge>
              )}
            </header>

            {doc.requiresSignature && (
              <SignatureList signatures={doc.signatures} next={state.next} />
            )}

            <footer className="doc-card__actions">
              {doc.pdfPath && (
                <Link to={doc.pdfPath} className={buttonClass("outline", "sm")}>
                  <Icon name="eye" size={16} /> Ver PDF
                </Link>
              )}
              {doc.requiresSignature && !state.complete && (
                <Button
                  size="sm"
                  icon={<Icon name="signature" size={16} />}
                  onClick={() => onSign(doc.id)}
                  disabled={!myTurn}
                  title={
                    myTurn
                      ? undefined
                      : `Aguardando a assinatura de ${state.next?.signer.name ?? "outra parte"}.`
                  }
                >
                  Assinar
                </Button>
              )}
            </footer>
          </article>
        );
      })}
    </div>
  );
}
