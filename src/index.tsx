import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DAppProvider, Config } from "@usedapp/core";

// @ts-ignore
import Header from "./components/Header/Header.tsx";
// @ts-ignore
import Home from "./pages/Home/Home.tsx";
// @ts-ignore
import MyNFTs from "./pages/MyNFTs/MyNFTs.tsx";

import "./tailwind.css";

const chainId = 31337;

const config: Config = {
  readOnlyChainId: chainId,
  readOnlyUrls: {
    [chainId]: "http://localhost:8545",
  },
};

const rootElement = document.getElementById("root");
render(
  <DAppProvider config={config}>
    <BrowserRouter>
      <div className="container mx-auto">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MyNFTs" element={<MyNFTs />} />
        </Routes>
      </div>
    </BrowserRouter>
  </DAppProvider>,
  rootElement
);
