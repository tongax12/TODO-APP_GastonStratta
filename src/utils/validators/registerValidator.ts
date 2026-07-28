const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_HAS_LETTER = /[a-zA-Z]/;
const PASSWORD_HAS_NUMBER = /[0-9]/;
const MIN_PASSWORD = 6;
const MAX_PASSWORD = 72;

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function validateRegister(data: RegisterData): string | null {
  const email = data.email.trim();

  if (!email) return "El email es obligatorio.";
  if (!EMAIL_REGEX.test(email)) return "El formato del email no es válido.";
  if (!data.password) return "La contraseña es obligatoria.";
  if (data.password.length < MIN_PASSWORD) return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`;
  if (data.password.length > MAX_PASSWORD) return `La contraseña no puede superar ${MAX_PASSWORD} caracteres.`;
  if (!PASSWORD_HAS_LETTER.test(data.password)) return "La contraseña debe contener al menos una letra.";
  if (!PASSWORD_HAS_NUMBER.test(data.password)) return "La contraseña debe contener al menos un número.";
  if (data.password !== data.confirmPassword) return "Las contraseñas no coinciden.";

  return null;
}