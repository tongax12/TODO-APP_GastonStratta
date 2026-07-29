import { describe, it, expect } from "vitest";
import { getFirebaseErrorMessage } from "../../utils/authErrors";

describe("getFirebaseErrorMessage", () => {
  const cases = [
    { code: "auth/email-already-in-use", expected: "Ya existe una cuenta con ese email." },
    { code: "auth/weak-password", expected: "La contraseña es muy débil." },
    { code: "auth/invalid-email", expected: "El email no es válido." },
    { code: "auth/operation-not-allowed", expected: expect.stringContaining("registro") },
    { code: "auth/invalid-api-key", expected: expect.stringContaining("API key") },
    { code: "auth/network-request-failed", expected: expect.stringContaining("conexión") },
    { code: "auth/invalid-credential", expected: "Email o contraseña incorrectos." },
    { code: "auth/user-not-found", expected: "Email o contraseña incorrectos." },
    { code: "auth/wrong-password", expected: "Email o contraseña incorrectos." },
  ];

  it.each(cases)("returns correct message for $code", ({ code, expected }) => {
    expect(getFirebaseErrorMessage(code)).toEqual(expected);
  });

  it("returns fallback for unknown code", () => {
    const result = getFirebaseErrorMessage("auth/unknown-error");
    expect(result).toBe("Ocurrió un error inesperado.");
  });

  it("uses custom fallback when provided", () => {
    const result = getFirebaseErrorMessage("auth/unknown-error", "Custom fallback");
    expect(result).toBe("Custom fallback");
  });
});
