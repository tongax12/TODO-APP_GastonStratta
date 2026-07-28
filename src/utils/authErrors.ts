const errorMessages: Record<string, string> = {
  // Register
  "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
  "auth/weak-password": "La contraseña es muy débil.",
  "auth/invalid-email": "El email no es válido.",
  "auth/operation-not-allowed":
    "El registro con email y contraseña no está habilitado. Activalo en la consola de Firebase > Authentication > Métodos de inicio de sesión.",
  "auth/invalid-api-key":
    "La API key de Firebase no es válida. Revisá la configuración en .env",
  "auth/network-request-failed":
    "Error de conexión. Verificá tu conexión a internet.",

  // Login
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/user-not-found": "Email o contraseña incorrectos.",
  "auth/wrong-password": "Email o contraseña incorrectos.",
}

export function getFirebaseErrorMessage(code: string, fallback = "Ocurrió un error inesperado."): string {
  return errorMessages[code] ?? fallback
}
