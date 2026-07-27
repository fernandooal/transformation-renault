import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { storage } from "../api.js";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function DocumentView() {
  const { id } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  // O PDF é servido por rota autenticada — o token vai no header.
  const file = useMemo(
    () => ({
      url: `/api/documents/${id}/file`,
      httpHeaders: { Authorization: `Bearer ${storage.getToken()}` },
    }),
    [id]
  );

  return (
    <div className="page">
      <header className="topbar">
        <Link to="/" className="ghost">
          ← Voltar
        </Link>
        <h1>Visualização de documento</h1>
      </header>

      <main className="pdf-viewer">
        {error && <p className="error">Falha ao carregar o PDF: {error}</p>}
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(err) => setError(err.message)}
          loading={<p className="muted">Carregando PDF...</p>}
        >
          <Page pageNumber={page} width={720} />
        </Document>
        {numPages && (
          <div className="pdf-controls">
            <button className="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Anterior
            </button>
            <span className="muted">
              Página {page} de {numPages}
            </span>
            <button
              className="ghost"
              disabled={page >= numPages}
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
