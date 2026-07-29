import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import "./Login.css";
import { validateLogin } from "../../utils/validators/loginValidator";
import { getFirebaseErrorMessage } from "../../utils/authErrors";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string })?.from ?? "/tasks";

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const error = validateLogin({ email, password });
    if (error) { setError(error); return; }


    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(
        code
          ? getFirebaseErrorMessage(code, "Ocurrió un error al iniciar sesión.")
          : "Ocurrió un error desconocido."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = (err as { code?: string }).code;
      // El usuario cerrando el popup no es un "error" real, no hace falta mostrar nada.
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        return;
      }
      setError(getFirebaseErrorMessage(code ?? "", "No se pudo continuar con Google."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login">
      <h1 className="login__title">Ingresar</h1>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__field">
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

        <div className="login__field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {error && <p className="login__error">{error}</p>}

        <button className="login__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando…" : "Ingresar"}
        </button>
      </form>

      <div className="login__divider">o continuá con</div>

      <button
        type="button"
        className="login__google-btn"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
          aria-hidden="true"
        />
        Continuar con Google
      </button>

      <p className="login__link">
        ¿No tenés cuenta?{" "}
        <Link to="/register">Crear una</Link>
      </p>
    </div>
  );
}