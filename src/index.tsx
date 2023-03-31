import React from "react";
import { createRoot } from "react-dom/client";

import "./config/blockly";
import "./config/blockly.blocks";

import "./global.css";

import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("root 要素が見つかりません");

createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
