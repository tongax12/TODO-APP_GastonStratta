const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginData {
  email: string;
  password: string;
}

export function validateLogin(data: LoginData): string | null {
  const email = data.email.trim();

  if (!email) return "El email es obligatorio.";
  if (!EMAIL_REGEX.test(email)) return "El formato del email no es válido.";
  if (!data.password) return "La contraseña es obligatoria.";

  return null;
}