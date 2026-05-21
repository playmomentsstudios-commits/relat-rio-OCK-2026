import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import "./styles/index.css";

const App = lazy(() => import("./app/App.tsx"));

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] flex items-center justify-center">
          Carregando dashboard...
        </div>
      }
    >
      <App />
    </Suspense>
  </HashRouter>
);
