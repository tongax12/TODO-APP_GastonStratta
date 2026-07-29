import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Authenticator } from "./features/auth/Authenticator";
import { ThemeProvider } from "./features/theme/ThemeProvider";
import App from "./App";
import "./index.css";

/**
 * Orden importa: BrowserRouter afuera de todo porque Authenticator y
 * RequireAuth usan hooks de router (useLocation/useNavigate). ThemeProvider
 * puede ir en cualquier posición relativa a Authenticator (no dependen entre
 * sí), pero lo dejamos afuera porque el tema es más "global" que la sesión.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Authenticator>
          <App />
        </Authenticator>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);