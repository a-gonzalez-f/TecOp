import "./Confirm.css";

function Confirm({
  open,
  title = "Confirmar",
  message = "¿Estás seguro?",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="confirmOverlay" onClick={onCancel}>
      <div className="confirmModal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirmActions">
          <button className="cancelButton" onClick={onCancel}>
            Cancelar
          </button>

          <button className="confirmButton" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirm;
