import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import constants from "./constants";

import Web3Context from "./context/Web3Context";
// @ts-ignore
import Header from "./components/Header/Header.tsx";
// @ts-ignore
import Footer from "./components/Footer/Footer.tsx";
// @ts-ignore
import Home from "./pages/Home/Home.tsx";
// @ts-ignore
import MyNFTs from "./pages/MyNFTs/MyNFTs.tsx";
// @ts-ignore
import getSigner from "./getSigner";
// @ts-ignore
import getContract from "./getContract";

export default function App() {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const initSignerAndContract = async () => {
      activateBrowserWallet();
      const _contract = await getContract();
      if (_contract) {
        setContract(_contract);
      } else {
        setErrorMessage(`Contract not found`);
        setShowErrorMessage(true);
      }
    };
    initSignerAndContract();
  }, []);

  const activateBrowserWallet = async () => {
    let _signer;
    try {
      _signer = await getSigner();
      setSigner(_signer);
    } catch (error) {
      switch (error.toString()) {
        case "Error: metamask-not-found":
          setErrorMessage(
            "Please install MetaMask to interact with application"
          );
          break;
        case "Error: wrong-network":
          setErrorMessage(`Please switch to ${constants.NETWORK_NAME} network`);
          break;
        default:
          break;
      }
      setShowErrorMessage(true);
      return;
    }
    setShowErrorMessage(false);
    const _account = await _signer.getAddress();
    setAccount(_account);
  };

  return (
    <Web3Context.Provider
      value={{
        signer,
        account,
        contract,
        errorMessage,
        showErrorMessage,
        activateBrowserWallet,
      }}
    >
      <BrowserRouter>
        <div className="container mx-auto">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/MyNFTs" element={<MyNFTs />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </Web3Context.Provider>
  );
}
