import { describe, it, expect } from "vitest";
import { validateLogin } from "../../utils/validators/loginValidator";

describe("validateLogin", () => {
  it("returns error when email is empty", () => {
    const result = validateLogin({ email: "", password: "123456" });
    expect(result).toBe("El email es obligatorio.");
  });

  it("returns error when email has invalid format", () => {
    const result = validateLogin({ email: "not-an-email", password: "123456" });
    expect(result).toBe("El formato del email no es válido.");
  });

  it("returns error when password is empty", () => {
    const result = validateLogin({ email: "test@example.com", password: "" });
    expect(result).toBe("La contraseña es obligatoria.");
  });

  it("returns null for valid data", () => {
    const result = validateLogin({ email: "test@example.com", password: "123456" });
    expect(result).toBeNull();
  });

  it("trims email before validating", () => {
    const result = validateLogin({ email: "  ", password: "123456" });
    expect(result).toBe("El email es obligatorio.");
  });
});
