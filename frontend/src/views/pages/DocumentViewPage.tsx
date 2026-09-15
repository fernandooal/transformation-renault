import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { fileSource } from "../../services/document.service";
import { Button } from "../components/ui";
import PageHeader from "../components/PageHeader";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function DocumentViewPage() {
  const { id } = useParams<{ id: string }>();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const file = useMemo(() => fileSource(id), [id]);

  return (
    <>
      <PageHeader title="Documento F4" back={{ to: "/f4", label: "Voltar" }} />

      <div className="pdf-viewer">
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
            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Anterior
            </Button>
            <span className="muted">
              Página {page} de {numPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= numPages}
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
