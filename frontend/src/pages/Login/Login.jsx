import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";

const dominio = import.meta.env.VITE_EMAIL_DOMAIN;

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      login(data.token);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="formContainer">
      <form className="ingreso" onSubmit={handleSubmit}>
        <div className="logo">
          <img className="logo-medium" src="/logo.png" alt="logo" />
          <h1>Tecnologías Digitales</h1>
        </div>
        <div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Usuario"
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
        </div>

        <button className="submitButton" type="submit">
          Ingresar
        </button>

        <Link className="signUpButton" to="/signup">
          O crear cuenta
        </Link>
      </form>
    </div>
  );
}

export default Login;
