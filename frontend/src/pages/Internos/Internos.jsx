import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { icons } from "../../assets/icons/Icons";
import toast from "react-hot-toast";
import "./Internos.css";
import Modal from "../../components/Modal/Modal";
import FormInterno from "../../components/FormInterno/FormInterno";

const Internos = () => {
  const { user } = useAuth();

  const habilitadoEdit = user?.role === "admin" || user?.role === "supervisor";

  const [search, setSearch] = useState("");
  const [internos, setInternos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInternos = async () => {
      if (search.trim().length < 1) {
        setInternos([]);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/internos?q=${search}`,
        );

        const data = await response.json();

        setInternos(data);
      } catch (error) {
        console.error("Error al buscar internos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternos();
  }, [search]);

  const handleEdit = (interno, field) => {
    setEditingCell({
      id: interno._id,
      field,
    });

    setEditValue(interno[field]);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleSave = async () => {
    if (!editingCell) return;
    if (!editValue.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/internos/${editingCell.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [editingCell.field]: editValue,
          }),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      const updatedInterno = await response.json();

      setInternos((prev) =>
        prev.map((interno) =>
          interno._id === updatedInterno._id ? updatedInterno : interno,
        ),
      );

      cancelEdit();
    } catch (error) {
      console.error("Error al actualizar:", error);

      toast.error("No se pudo actualizar el interno");
    }
  };

  const renderEditableCell = (interno, field) => {
    const isEditing =
      editingCell?.id === interno._id && editingCell?.field === field;

    if (isEditing) {
      return (
        <div className="inputEdit">
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }

              if (e.key === "Escape") {
                cancelEdit();
              }
            }}
          />

          <div className="confirmEdit">
            <button onClick={handleSave} disabled={!editValue.trim()}>
              {icons.check}
            </button>
            <button onClick={cancelEdit}>{icons.close}</button>
          </div>
        </div>
      );
    }

    return (
      <div className="cellContent">
        {interno[field]}

        {habilitadoEdit && (
          <button
            className="editButton"
            onClick={() => handleEdit(interno, field)}
          >
            {icons.edit}
          </button>
        )}
      </div>
    );
  };

  return (
    <main className="internosPage page">
      <div className="searchContainer">
        <input
          className="searchInternos"
          placeholder="Buscar interno, línea, referencia..."
          maxLength={20}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {habilitadoEdit && (
          <button id="addInterno" onClick={() => setShowModal(true)}>
            {icons.add}
          </button>
        )}
      </div>

      <div className="containerInternos">
        <table id="internos">
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className="loading">{icons.loading}</div>
                </td>
              </tr>
            ) : internos.length > 0 ? (
              internos.map((interno) => (
                <tr key={interno._id}>
                  <td>{renderEditableCell(interno, "LINEA")}</td>
                  <td>{renderEditableCell(interno, "REF1")}</td>
                  <td>{renderEditableCell(interno, "REF2")}</td>
                  <td>{interno.INTERNO}</td>
                </tr>
              ))
            ) : (
              search.trim().length > 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="emptyMessage">
                      No se encontraron coincidencias
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <FormInterno
          onClose={() => setShowModal(false)}
          onCreated={(newInterno) => {
            setInternos((prev) => [newInterno, ...prev]);
            setShowModal(false);
          }}
        />
      </Modal>
    </main>
  );
};

export default Internos;
