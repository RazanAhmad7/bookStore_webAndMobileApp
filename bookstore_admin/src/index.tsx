import { createRoot } from "react-dom/client";

import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error("No container found");
}
const root = createRoot(container);

// Render the app directly without fake server
root.render(<App />);
