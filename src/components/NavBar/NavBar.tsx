import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./Navbar.css";
import { useAuth } from "../../features/auth/Authenticator";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // toggle mobile-first

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar__bar">
        <Link to="/" className="navbar__brand">
          Tareas
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="navbar-menu"
          aria-label="Abrir menú"
        >
          <span aria-hidden="true">☰</span>
        </button>
      </div>

      <div
        id="navbar-menu"
        className={`navbar__menu ${isMenuOpen ? "navbar__menu--open" : ""}`}
      >
        {user ? (
          <>
            <Link to="/tasks" onClick={() => setIsMenuOpen(false)}>
              Mis tareas
            </Link>
            <span className="navbar__user">{user.email}</span>
            <button className="navbar__logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              Ingresar
            </Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}