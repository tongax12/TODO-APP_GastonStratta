# CONTEXTO GLOBAL:

Estoy haciendo una TODO App con las siguientes tecnologias (solo anexé las tecnologías más importantes a nivel visual):
-React 19
- TypeScript
- Vite

## Prompt enviado: ( Guía de mejoras de Diseño ) 

A continuación te dejo los archivos que hay en la carpeta componentes (.tsx y .css), de la carpeta Pages (.tsx y .css) y los archivos App.tsx, App.css, index.css y main.tsx para que tengas contexto de lo visual, además te dejo imagenés de cada Pages ( Login, Register y Tasks).

El diseño que tiene en este momento es básico para poder probar que anden las funcionalidades.

Quiero que me ayudes guiandome en mejoras y efectos visuales que pueda hacer una interfaz UI/UX más amigable.

## Respuesta de la IA:

| Mejora                           | Descripción                                                      |
| -------------------------------- | ---------------------------------------------------------------- |
| **Sombras más profundas**        | Box-shadow con capas para efecto de elevación                    |
| **Hover effects**                | `translateY(-2px)` + sombra en cards y botones                   |
| **Shimmer en botones primarios** | Efecto de brillo que pasa al hacer hover                         |
| **Focus glow**                   | Doble sombra en inputs (`box-shadow` + anillo)                   |
| **Labels animadas**              | Cambian de color al enfocar el input                             |
| **Animaciones de entrada**       | `@keyframes` con delays escalonados para lista de tareas         |
| **Checkbox pop**                 | Escala animada al marcar una tarea                               |
| **Error shake**                  | Sacudida en mensajes de error                                    |
| **Gradiente animado**            | Fondo de login/register que se desplaza suavemente               |
| **Glassmorphism navbar**         | `backdrop-filter: blur(12px)`                                    |
| **Patrón de puntos**             | Fondo sutil en la página de tareas                               |
| **Accesibilidad**                | `prefers-reduced-motion` para respetar configuración del usuario |

Paleta de colores propuesta: Teal & Coral
--color-primary: #0d9488;
--color-primary-hover: #0f766e;
--color-primary-soft: #f0fdfa;
--color-success: #10b981;
--color-warning: #f59e0b;
--color-danger: #ef4444;
--color-priority-high: #f97316;
--color-bg: #f0fdfa;
--color-navbar-bg: #0f172a;


## Prompt enviado: ( ayuda para encontrar el error en un test )

Estoy haciendo los test y en el de TaskForm en el caso de probar que el botón de subir una tarea se deshabilite cuando el estado se encuentra en isSubmitting met tira el siguiente error: 
stderr | src/test/components/TaskForm.test.tsx > TaskForm > disables submit button while isSubmitting
An update to TaskForm inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to TaskForm inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

## Respuesta de la IA:

Este warning de React Testing Library aparece cuando disparás un evento que causa una actualización de estado, pero el test no espera a que React termine de renderizar antes de hacer el expect.
La solución es usar await con userEvent (que ya hace act internamente) o envolver en act() si usás fireEvent.

Opción 1: Usar userEvent (recomendado)
userEvent de @testing-library/user-event ya maneja act automáticamente. Asegurate de usar la versión 14+.

Opción 2: Si usás fireEvent, envolvé en act

Opción 3: Si el problema es waitFor
A veces el warning aparece cuando usás waitFor sin await

Opción 4: Si usás userEvent pero sin await

## Prompt enviado: ( resumen de los errores de eslint )

Ejecuté en la terminal el comando npm run lint y me tiró los siguientes errores:

(le pasé los errores)

haceme una guía resumen de cada error.

## Respuesta de la IA:

- ThemeProvider.tsx — el error es porque el archivo exporta tanto el componente ThemeProvider como la función useTheme, y Fast Refresh (el hot-reload de Vite) necesita que un archivo que exporta componentes solo exporte componentes.

- Authenticator.tsx tiene el mismo error, en el mismo patrón (exporta el Provider + el hook useAuth).

- api/send-email.ts (línea 45, el any).

- EmailSummaryButton.tsx (línea 60, la variable error sin usar).

- taskService.ts (línea 33, falta el { cause: err } al relanzar el error).

- RequireAuth.test.tsx (línea 27, el any).

- test-utils.tsx completo (el error de Fast Refresh acá es un falso positivo — es un archivo de test, no de la app, así que la forma correcta de arreglarlo es excluir src/test/** del lint rule, no tocar el código).

- eslint.config.js (para hacer esa exclusión de test-utils correctamente, en vez de poner un disable suelto).

- Este (react-hooks/set-state-in-effect) es un lint nuevo y bastante estricto — marca un patrón que técnicamente puede causar renders en cascada, pero que en tus tres casos (FilteredTaskList, TaskForm, useTask) es exactamente el patrón recomendado por la documentación de React para sincronizar estado local con props/datos externos (sección "Adjusting some state when a prop changes").


## Otras ayudas de la IA:

-También consulté errores o warnings que me salían en la escritura del código y que no entendía. 
-Ayuda en el uso de los servicios externos del proyecto ( AWS, Firebase y Vercel)
