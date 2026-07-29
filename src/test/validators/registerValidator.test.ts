import { describe, it, expect } from "vitest";
import { validateRegister } from "../../utils/validators/registerValidator";

const validData = {
  email: "test@example.com",
  password: "abc123",
  confirmPassword: "abc123",
};

describe("validateRegister", () => {
  it("returns error when email is empty", () => {
    const result = validateRegister({ ...validData, email: "" });
    expect(result).toBe("El email es obligatorio.");
  });

  it("returns error when email is invalid", () => {
    const result = validateRegister({ ...validData, email: "invalid" });
    expect(result).toBe("El formato del email no es válido.");
  });

  it("returns error when password is empty", () => {
    const result = validateRegister({ ...validData, password: "" });
    expect(result).toBe("La contraseña es obligatoria.");
  });

  it("returns error when password is too short", () => {
    const result = validateRegister({ ...validData, password: "ab1" });
    expect(result).toBe("La contraseña debe tener al menos 6 caracteres.");
  });

  it("returns error when password is too long", () => {
    const result = validateRegister({ ...validData, password: "a1" + "x".repeat(71) });
    expect(result).toBe("La contraseña no puede superar 72 caracteres.");
  });

  it("returns error when password has no letter", () => {
    const result = validateRegister({ ...validData, password: "123456" });
    expect(result).toBe("La contraseña debe contener al menos una letra.");
  });

  it("returns error when password has no number", () => {
    const result = validateRegister({ ...validData, password: "abcdef" });
    expect(result).toBe("La contraseña debe contener al menos un número.");
  });

  it("returns error when passwords do not match", () => {
    const result = validateRegister({ ...validData, confirmPassword: "different" });
    expect(result).toBe("Las contraseñas no coinciden.");
  });

  it("returns null for valid data", () => {
    const result = validateRegister(validData);
    expect(result).toBeNull();
  });
});
