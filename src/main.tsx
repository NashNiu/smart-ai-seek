import "@/assets/styles/index.css";
import { theme } from "@/utils";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import Content from "./App.tsx";
import { App } from "antd";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App>
          <Content />
        </App>
      </ThemeProvider>
    </BrowserRouter>
  // </StrictMode>
);

