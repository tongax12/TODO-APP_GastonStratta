import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./NavBar.css";
import { useAuth } from "../../features/auth/useAuth";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  async function handleLogout() {
    await signOut(auth);
    setIsMenuOpen(false);
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar__bar">
        {/* LEFT: solo la marca */}
        <div className="navbar__left">
          <Link to="/" className="navbar__brand">
            MateCode
          </Link>
        </div>

        {/* RIGHT: auth buttons + user + logout + theme toggle + menú, todo agrupado a la derecha */}
        <div className="navbar__right">
          {!user && (
            <div className="navbar__auth">
              <Link to="/login" className="navbar__auth-btn">
                Ingresar
              </Link>
              <Link to="/register" className="navbar__auth-btn navbar__auth-btn--primary">
                Crear cuenta
              </Link>
            </div>
          )}

          {user && (
            <>
              <span className="navbar__user">{user.email}</span>
              <button className="navbar__logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}

          <ThemeToggle />

          <button
            className="navbar__toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="navbar__menu">
          {user ? (
            <>
              <span className="navbar__user--mobile">{user.email}</span>
              <button className="navbar__logout navbar__logout--mobile" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__auth-btn" onClick={() => setIsMenuOpen(false)}>
                Ingresar
              </Link>
              <Link to="/register" className="navbar__auth-btn navbar__auth-btn--primary" onClick={() => setIsMenuOpen(false)}>
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}