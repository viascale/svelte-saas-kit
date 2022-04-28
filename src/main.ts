import "./assets/css/index.css";
import App from "./App.svelte";

import "./assets/css/index.css";
import "./plugins/logging";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
