import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import "./lib/i18n"; // Initialize i18n

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

if (import.meta.env.PROD) {
  import('./pwa').then(({ registerServiceWorker }) => {
    registerServiceWorker();
  });
}
