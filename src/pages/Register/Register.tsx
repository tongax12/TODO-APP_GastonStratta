import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import "./Register.css";
import { validateRegister } from "../../utils/validators/registerValidator";
import { getFirebaseErrorMessage } from "../../utils/authErrors";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Redirige automáticamente cuando Firebase confirma la sesión activa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/tasks", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const validationError = validateRegister({ email, password, confirmPassword });
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Error al crear cuenta:", err);
      const code = (err as { code?: string }).code;
      setError(
        code
          ? getFirebaseErrorMessage(code, "Ocurrió un error al crear la cuenta.")
          : "Ocurrió un error desconocido."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsSubmitting(true);

    // Forzamos a Google a pedir siempre selección de cuenta
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      const code = (err as { code?: string }).code;

      // Si el usuario cierra o cancela la ventana emergente, ignoramos el error
      if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        return;
      }

      setError(getFirebaseErrorMessage(code ?? "", "No se pudo continuar con Google."));
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

      <div className="register__divider">o continuá con</div>

      <button
        type="button"
        className="register__google-btn"
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

      <p className="register__link">
        ¿Ya tenés cuenta? <Link to="/login">Ingresar</Link>
      </p>
    </div>
  );
}