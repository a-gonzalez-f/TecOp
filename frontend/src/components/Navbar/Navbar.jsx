import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const username = user?.email?.split("@")[0];

  return (
    <nav className="navbar">
      <Link to="/" onClick={() => setOpen(false)}>
        <h2>TecOp</h2>
      </Link>

      <div className={`links ${open ? "open" : ""}`}>
        <NavLink to="/" onClick={() => setOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/rtu" onClick={() => setOpen(false)}>
          RTUs
        </NavLink>

        <NavLink to="/engrasadoras" onClick={() => setOpen(false)}>
          Engrasadoras
        </NavLink>

        <NavLink to="/radios" onClick={() => setOpen(false)}>
          Radios
        </NavLink>

        <NavLink to="/internos" onClick={() => setOpen(false)}>
          Internos
        </NavLink>

        {!user ? (
          <NavLink to="/login" onClick={() => setOpen(false)}>
            Ingresar
          </NavLink>
        ) : (
          <button className="userLogOut" onClick={logout}>
            {username} (Salir)
          </button>
        )}
      </div>

      <button className="menu" onClick={() => setOpen(!open)}>
        ☰
      </button>
    </nav>
  );
}

export default Navbar;
