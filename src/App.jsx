import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Routes from "./Routes";

function App() {
  return (
    <HelmetProvider>
      <Routes />
    </HelmetProvider>
  );
}

export default App;
