import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./CSS/components/loading.css";
import "./CSS/components/google.css";
import "./CSS/components/Button.css";
import "./CSS/components/alert.css";
import "./CSS/components/form.css";
import "./CSS/Base/media.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as RouteManager } from "react-router-dom";
import { ContextManager } from "./Context/conetxt.jsx";
import { WindowContext } from "./Context/WindowContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WindowContext>
      <ContextManager>
        <RouteManager>
          <App />
        </RouteManager>
      </ContextManager>
    </WindowContext>
  </React.StrictMode>
);
