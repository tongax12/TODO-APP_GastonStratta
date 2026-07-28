import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Authenticator } from "./features/auth/Authenticator";
import App from "./App";
import "./index.css";


/**
 * Orden importa: BrowserRouter afuera de AuthProvider porque RequireAuth usa
 * useLocation/useNavigate (necesita el router), y AuthProvider afuera de App
 * porque toda la app (Navbar, RequireAuth, páginas) necesita leer useAuth.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Authenticator>
        <App />
      </Authenticator>
    </BrowserRouter>
  </StrictMode>
);