import "./Admin.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { icons } from "../../assets/icons/Icons";
import toast from "react-hot-toast";

const dominio = import.meta.env.VITE_EMAIL_DOMAIN;

function Admin() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailNuevo, setEmailNuevo] = useState("");
  const [autorizados, setAutorizados] = useState([]);

  const invalidEmail = emailNuevo && !emailNuevo.endsWith(`@${dominio}`);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setAutorizados(data);
    } catch (err) {
      toast.error(err.message || "Error al cargar usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (invalidEmail) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/authorize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: emailNuevo,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "Usuario autorizado");

      setAutorizados((prev) => [...prev, data.user]);

      setEmailNuevo("");
    } catch (err) {
      toast.error(err.message || "Error al autorizar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId) => {
    const confirmed = window.confirm(
      "¿Seguro que querés habilitar/deshabilitar al usuario?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "Usuario actualizado");

      setAutorizados((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, enabled: data.enabled } : u,
        ),
      );
    } catch (err) {
      toast.error(err.message || "Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (userId) => {
    const confirmed = window.confirm(
      "¿Seguro que querés resetear la contraseña del usuario?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/reset-password`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "Contraseña reseteada");

      setAutorizados((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                passwordHash: null,
                signupCompleted: false,
                enabled: true,
              }
            : u,
        ),
      );
    } catch (err) {
      toast.error(err.message || "Error al resetear contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (userId, role) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Rol actualizado");

      setAutorizados((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u)),
      );
    } catch (err) {
      toast.error(err.message || "Error al actualizar rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="autorizaciones page">
      <form id="formAutorizar" onSubmit={handleSubmit}>
        <div className="container">
          <label htmlFor="email">
            Autorizar signup de:
            <input
              type="email"
              name="email"
              id="email"
              placeholder="usuario@dominio.com.ar"
              value={emailNuevo}
              onChange={(e) => setEmailNuevo(e.target.value)}
              autoComplete="off"
              className={invalidEmail ? "invalid" : ""}
            />
          </label>

          <button
            id="addEmailBtn"
            type="submit"
            disabled={loading || invalidEmail}
          >
            {icons.add}
          </button>
        </div>
      </form>

      {autorizados.length > 0 && (
        <div className="autorizados">
          <h2>Autorizados</h2>

          <table className="autorizadosTable">
            <thead>
              <tr>
                <th>Email</th>
                <th>Signup</th>
                <th>Rol</th>
                <th>Habilitado</th>
                <th>Restablecer</th>
              </tr>
            </thead>

            <tbody>
              {autorizados.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.signupCompleted ? "Completo" : "Incompleto"}</td>
                  <td>
                    <select
                      name="role"
                      id="role"
                      value={user.role}
                      disabled={loading}
                      onChange={(e) => handleChange(user._id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="user">Usuario</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggle(user._id)}
                      className="actionButton"
                      disabled={loading}
                    >
                      {user.enabled ? icons.toggleOn : icons.toggleOff}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleReset(user._id)}
                      className="actionButton"
                      disabled={loading}
                    >
                      {icons.restart}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Admin;
