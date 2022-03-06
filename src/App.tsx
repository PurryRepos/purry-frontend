import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import constants from "./constants";
import Web3Context from "./context/Web3Context";
import getProvider from "./utils/getProvider";
import getSigner from "./getSigner";
import getContract from "./getContract";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Thread from "./pages/Thread/Thread";
import Profile from "./pages/Profile/Profile";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const initSignerAndContract = async () => {
      const _provider = await getProvider();
      setProvider(_provider);
      const _contract: any = await getContract(_provider);
      if (!_provider.isInfura) {
        activateBrowserWallet(_provider);
      }
      if (_contract) {
        setContract(_contract);
      } else {
        setErrorMessage(`Contract not found`);
        setShowErrorMessage(true);
      }
    };
    initSignerAndContract();
  }, []);

  const activateBrowserWallet = async (_provider) => {
    try {
      const _signer = await getSigner(_provider);
      setSigner(_signer);
      if (_signer && !_signer.isInfura) {
        const _account = await _signer.getAddress();
        setAccount(_account);
      }
    } catch (error: any) {
      switch (error.toString()) {
        case "Error: metamask-not-found":
          setErrorMessage(
            "Please install MetaMask to interact with the application"
          );
          break;
        case "Error: wrong-network":
          setErrorMessage(`Please switch to ${constants.NETWORK_NAME} network`);
          break;
        default:
          setErrorMessage(
            "Please install MetaMask to interact with the application"
          );
          break;
      }
      setShowErrorMessage(true);
      return;
    }
    setShowErrorMessage(false);
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account: account.toLowerCase(),
        contract,
        errorMessage,
        showErrorMessage,
        activateBrowserWallet,
      }}
    >
      <BrowserRouter>
        <ReactNotifications />
        <Header />
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/thread/:tokenId" element={<Thread />} />
            <Route path="/user/:address" element={<Profile />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </Web3Context.Provider>
  );
}
