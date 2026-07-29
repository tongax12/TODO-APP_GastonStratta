import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, cleanup } from "@testing-library/react";
import { render } from "../test-utils";

// Mock ANTES de importar el componente
vi.doMock("../../features/auth/Authenticator", () => ({
  useAuth: vi.fn(),
}));

// Importar DESPUÉS del mock
const { RequireAuth } = await import("../../components/RequireAuth/RequireAuth");
const { useAuth } = await import("../../features/auth/Authenticator");

const mockedUseAuth = vi.mocked(useAuth);

describe("RequireAuth", () => {
  beforeEach(() => {
    mockedUseAuth.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders children when user is authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: { uid: "123", email: "test@test.com" } as any,
      isLoading: false,
    });

    render(
      <RequireAuth>
        <p>Protected content</p>
      </RequireAuth>,
      { initialEntries: ["/tasks"] },
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });



   it("shows loading state while checking auth", () => {
    mockedUseAuth.mockReturnValue({ user: null, isLoading: true });

    render(
      <RequireAuth>
        <p>Protected content</p>
      </RequireAuth>,
      { initialEntries: ["/tasks"] },
    );

    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  }); 
});
