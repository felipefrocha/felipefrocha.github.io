import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.env.PROD) {
  import('./pwa').then(({ registerServiceWorker }) => {
    registerServiceWorker();
  });
}
