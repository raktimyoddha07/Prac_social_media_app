import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import App from "./App";
import { store } from "./app/store";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);