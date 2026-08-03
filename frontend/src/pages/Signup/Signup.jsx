import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { icons } from "../../assets/icons/Icons";
import "./Signup.css";

const dominio = import.meta.env.VITE_EMAIL_DOMAIN;

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("idle");
  const [aclaracionMail, setAclaracionMail] = useState(
    `Utilizá tu mail de ${dominio} autorizado`,
  );

  const { email, password, confirmPassword } = formData;

  const invalidEmail = email && !email.endsWith(`@${dominio}`);
  const invalidPsw = password && password.length < 8;
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const isFormInvalid =
    !email ||
    !password ||
    !confirmPassword ||
    invalidEmail ||
    invalidPsw ||
    passwordMismatch ||
    emailStatus !== "valid";

  useEffect(() => {
    if (!email) {
      setEmailStatus("idle");
      setAclaracionMail(`Utilizá tu mail de ${dominio} autorizado`);
      return;
    }

    if (invalidEmail) {
      setEmailStatus("idle");
      setAclaracionMail(`El mail debe terminar en @${dominio}`);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setEmailStatus("loading");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/check-email/${encodeURIComponent(email)}`,
        );

        const data = await response.json();

        if (!data.exists) {
          setEmailStatus("invalid");
          setAclaracionMail("Tu mail no ha sido autorizado");
          return;
        }

        if (!data.enabled) {
          setEmailStatus("invalid");
          setAclaracionMail("Tu usuario está deshabilitado");
          return;
        }

        if (data.signupCompleted) {
          setEmailStatus("invalid");
          setAclaracionMail("Ya existe una cuenta creada con este mail");
          return;
        }

        setEmailStatus("valid");
        setAclaracionMail("Mail autorizado ✅");
      } catch (err) {
        setEmailStatus("invalid");
        setAclaracionMail("Error al verificar mail autorizado");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormInvalid) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/signup`,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success(data.message || "Cuenta creada");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <Link to="/">
        <div className="chevronBack">{icons.chevronBack}</div>
      </Link>

      <form className="ingreso signup" onSubmit={handleSubmit}>
        <h1>Creá tu cuenta</h1>
        <div className="signupContent">
          <div className="inputContainer">
            {emailStatus === "loading" && (
              <div className="loading">{icons.loading}</div>
            )}
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder={`usuario@${dominio}`}
              className={`
              ${invalidEmail ? "invalid" : ""}
              ${emailStatus === "valid" ? "valid" : ""}
              ${emailStatus === "invalid" ? "invalid" : ""}
            `}
              autoComplete="off"
            />

            <p className="aclaracion">{aclaracionMail}</p>
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Contraseña"
              className={invalidPsw ? "invalid" : ""}
            />

            <p className="aclaracion">
              Creá tu contraseña (8 caracteres mínimo)
            </p>
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Repetí la contraseña"
              className={passwordMismatch ? "invalid" : ""}
            />

            {passwordMismatch && (
              <p className="aclaracion warn">Las contraseñas no coinciden</p>
            )}
          </div>
        </div>
        <button
          className="submitButton"
          type="submit"
          disabled={isFormInvalid || loading}
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
