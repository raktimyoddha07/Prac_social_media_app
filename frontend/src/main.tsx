import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ChakraProvider, defaultSystem, Theme } from "@chakra-ui/react";
import { system } from "./theme/theme";
import App from "./App";
import { store } from "./app/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider value={system}>
        <Theme appearance="dark">
          <App />
        </Theme>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);