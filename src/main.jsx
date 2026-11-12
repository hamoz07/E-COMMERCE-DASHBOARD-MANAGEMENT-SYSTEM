import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./styles/theme.css";
import "./styles/components/loading.css";
import "./styles/components/google.css";
import "./styles/components/alert.css";
import "./styles/components/form.css";
import "./styles/Base/media.css";
import "react-image-gallery/styles/image-gallery.css";
import { BrowserRouter as RouteManager } from "react-router-dom";
import { ContextManager } from "./context/context.jsx";
import { WindowContext } from "./context/WindowContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./routes/AppRouter.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/index.js";
import { CurrentUserProvider } from "./context/currentUserContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ToastList from "./components/feedback/ToastList.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <CurrentUserProvider>
              <WindowContext>
                <ContextManager>
                  <RouteManager>
                    <AppRouter />
                  </RouteManager>
                  <ToastList />
                </ContextManager>
              </WindowContext>
            </CurrentUserProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
