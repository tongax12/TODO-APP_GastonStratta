import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./Register.css";
import { validateRegister } from "../../utils/validators/registerValidator";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const error = validateRegister({ email, password, confirmPassword });
    if (error) { setError(error); return; }

    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/tasks", { replace: true });
    } catch (err) {
      console.error("Error al crear cuenta:", err);
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        setError("Ya existe una cuenta con ese email.");
      } else if (code === "auth/weak-password") {
        setError("La contraseña es muy débil.");
      } else if (code === "auth/invalid-email") {
        setError("El email no es válido.");
      } else if (code === "auth/operation-not-allowed") {
        setError("El registro con email y contraseña no está habilitado. Activalo en la consola de Firebase > Authentication > Métodos de inicio de sesión.");
      } else if (code === "auth/invalid-api-key") {
        setError("La API key de Firebase no es válida. Revisá la configuración en .env");
      } else if (code === "auth/network-request-failed") {
        setError("Error de conexión. Verificá tu conexión a internet.");
      } else {
        setError(`Ocurrió un error al crear la cuenta. (${code ?? "desconocido"})`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="register">
      <h1 className="register__title">Crear cuenta</h1>

      <form className="register__form" onSubmit={handleSubmit}>
        <div className="register__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
          />
        </div>

        <div className="register__field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        </div>

        <div className="register__field">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetí la contraseña"
            autoComplete="new-password"
          />
        </div>

        {error && <p className="register__error">{error}</p>}

        <button className="register__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="register__link">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login">Ingresar</Link>
      </p>
    </div>
  );
}