// src/index.js

if (window.location.pathname === "/healthz") {
  document.write("OK");
} else {
  import("./main");
}
