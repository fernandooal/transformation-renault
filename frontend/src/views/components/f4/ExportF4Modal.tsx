import { Button, Modal, TextField } from "../ui";
import { EXPORT_FORMATS, EXPORT_SCOPES } from "../../../models/f4Export";
import type { useF4Export } from "../../../controllers/useF4Export";

export default function ExportF4Modal({ x }: { x: ReturnType<typeof useF4Export> }) {
  return (
    <Modal
      open={x.open}
      onClose={() => x.setOpen(false)}
      title="Exportar F4's"
      className="modal--form"
    >
      <h2 className="modal__title">Exportar F4's</h2>

      <div className="export-scope" role="radiogroup" aria-label="O que exportar">
        {EXPORT_SCOPES.map((scope) => (
          <label key={scope.id} className="export-option">
            <input
              type="radio"
              name="export-scope"
              checked={x.scope === scope.id}
              onChange={() =>
                scope.id === "selecao" && !x.selectionMode
                  ? x.startSelection()
                  : x.setScope(scope.id)
              }
            />
            <span>
              <span className="export-option__label">{scope.label}</span>
              <span className="export-option__hint">{scope.hint}</span>
            </span>
          </label>
        ))}
      </div>

      {x.scope === "periodo" && (
        <div className="export-period">
          <TextField label="De" type="date" value={x.from} onChange={x.setFrom} />
          <TextField label="Até" type="date" value={x.to} onChange={x.setTo} />
        </div>
      )}

      <div className="export-format" role="group" aria-label="Formato do arquivo">
        {EXPORT_FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="chip"
            aria-pressed={x.format === f.id}
            onClick={() => x.setFormat(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="export-summary">
        {x.error ? (
          <span className="error">{x.error}</span>
        ) : (
          <span>
            {x.count} {x.count === 1 ? "F4 será exportada" : "F4's serão exportadas"}.
          </span>
        )}
      </p>

      <div className="modal__actions">
        <Button variant="outline" onClick={() => x.setOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={x.run} disabled={x.error !== null}>
          Exportar
        </Button>
      </div>
    </Modal>
  );
}
