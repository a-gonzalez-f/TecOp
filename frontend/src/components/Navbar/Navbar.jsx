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

        <NavLink to="/activo1" onClick={() => setOpen(false)}>
          Activo1
        </NavLink>

        <NavLink to="/activo2" onClick={() => setOpen(false)}>
          Activo2
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
