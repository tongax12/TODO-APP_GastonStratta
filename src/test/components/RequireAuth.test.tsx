import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, cleanup } from "@testing-library/react";
import { render } from "../test-utils";
import type { User } from "firebase/auth";

// 1. Mock de react-router-dom para interceptar Navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate-mock">{to}</div>,
  };
});

// 2. Mock de la ruta EXACTA de donde RequireAuth importa useAuth
vi.doMock("../../features/auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

// 3. Carga dinámica de los módulos mockeados
const { RequireAuth } = await import("../../components/RequireAuth/RequireAuth");
const { useAuth } = await import("../../features/auth/useAuth");

const mockedUseAuth = vi.mocked(useAuth);

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    uid: "123",
    email: "test@test.com",
    ...overrides,
  } as unknown as User;
}

describe("RequireAuth", () => {
  beforeEach(() => {
    mockedUseAuth.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders children when user is authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: createMockUser(),
      isLoading: false,
    });

    render(
      <RequireAuth>
        <p>Protected content</p>
      </RequireAuth>,
      { initialEntries: ["/tasks"] }
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("shows loading state while checking auth", () => {
    mockedUseAuth.mockReturnValue({ user: null, isLoading: true });

    render(
      <RequireAuth>
        <p>Protected content</p>
      </RequireAuth>,
      { initialEntries: ["/tasks"] }
    );

    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects to /login when user is not authenticated", () => {
    mockedUseAuth.mockReturnValue({ user: null, isLoading: false });

    render(
      <RequireAuth>
        <p>Protected content</p>
      </RequireAuth>,
      { initialEntries: ["/tasks"] }
    );

    // El contenido protegido NO debe mostrarse
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();

    // Verificamos que se renderice el mock de Navigate apuntando a /login
    expect(screen.getByTestId("navigate-mock")).toHaveTextContent("/login");
  });
});