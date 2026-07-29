import { describe, it, expect } from "vitest";
import { validateTask } from "../../utils/validators/taskValidator";
import { createMockFormData } from "../test-utils";

describe("validateTask", () => {
  it("returns error when title is empty", () => {
    const result = validateTask(createMockFormData({ title: "" }));
    expect(result).toBe("El título es obligatorio.");
  });

  it("returns error when title is only whitespace", () => {
    const result = validateTask(createMockFormData({ title: "   " }));
    expect(result).toBe("El título es obligatorio.");
  });

  it("returns error when title exceeds 100 characters", () => {
    const result = validateTask(createMockFormData({ title: "a".repeat(101) }));
    expect(result).toBe("El título no puede superar 100 caracteres.");
  });

  it("returns error when description exceeds 255 characters", () => {
    const result = validateTask(createMockFormData({ description: "a".repeat(256) }));
    expect(result).toBe("La descripción no puede superar 255 caracteres.");
  });

  it("returns error when dueDate is in the past", () => {
    const result = validateTask(createMockFormData({ dueDate: "2020-01-01" }));
    expect(result).toBe("La fecha de vencimiento no puede ser en el pasado.");
  });

  it("returns null for valid data", () => {
    const result = validateTask(createMockFormData());
    expect(result).toBeNull();
  });

  it("returns null when dueDate is empty", () => {
    const result = validateTask(createMockFormData({ dueDate: "" }));
    expect(result).toBeNull();
  });
});
