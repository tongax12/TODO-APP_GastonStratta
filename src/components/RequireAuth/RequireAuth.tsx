import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/Authenticator";


interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Envuelve cualquier ruta que solo debería verse logueado.
 * Uso:
 *   <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
 *
 * Mientras Firebase todavía no resolvió si hay sesión (isLoading), no redirige
 * de una: eso causaría un "parpadeo" al login en cada refresh de página.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="auth-guard-loading" role="status" aria-live="polite">
        Verificando sesión…
      </div>
    );
  }

  if (!user) {
    // Guardamos la ruta que el usuario quería ver para volver ahí después del login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}