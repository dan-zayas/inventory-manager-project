import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"
import StoreProvider from './utils/store'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
        <App />
    </StoreProvider>
  </React.StrictMode>,
)
