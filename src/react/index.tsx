import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";

import App from "./App";

const root = document.getElementById("root")!;

createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
