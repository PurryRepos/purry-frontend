import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

import Web3Context from "../../context/Web3Context";
import truncateAddress from "../../utils/truncateAddress";
import constants from "../../constants";

import metamaskIcon from "../../assets/metamask.svg";

import type { Web3ContextType } from "../../context/Web3Context";

import "./Header.css";

export default function Header() {
  const web3Context: Web3ContextType = useContext(Web3Context);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSwitchNetworkButton, setShowSwitchNetworkButton] = useState(false);
  const [showConnectWalletButton, setShowConnectWalletButton] = useState(false);
  const [showProfileButton, setShowProfileButton] = useState(false);

  const init = async () => {
    const isMetamaskUnlocked = await window.ethereum?._metamask.isUnlocked();
    setShowSwitchNetworkButton(isShowSwitchNetworkButton(isMetamaskUnlocked));
    setShowConnectWalletButton(isShowConnectWalletButton(isMetamaskUnlocked));
    setShowProfileButton(isShowProfileButton(isMetamaskUnlocked));
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (web3Context.provider) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Context]);

  const switchNetwork = async () => {
    if (window.ethereum.networkVersion !== constants.CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            { chainId: ethers.utils.hexlify(parseInt(constants.CHAIN_ID)) },
          ],
        });
        window.location.reload();
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Avalanche Fuji Testnet",
                chainId: ethers.utils.hexlify(parseInt(constants.CHAIN_ID)),
                nativeCurrency: {
                  name: "AVAX",
                  decimals: 18,
                  symbol: "AVAX",
                },
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
              },
            ],
          });
          window.location.reload();
        }
      }
    }
  };

  const isShowSwitchNetworkButton = (isMetamaskUnlocked: boolean): boolean => {
    return (
      isMetamaskUnlocked &&
      window.ethereum?.networkVersion !== constants.CHAIN_ID
    );
  };

  const isShowConnectWalletButton = (isMetamaskUnlocked: boolean): boolean => {
    return window.ethereum && !isMetamaskUnlocked;
  };

  const isShowProfileButton = (isMetamaskUnlocked: boolean): boolean => {
    return web3Context.account && isMetamaskUnlocked;
  };

  const showConnectWalletAddress = () => {
    return (
      window.ethereum?.networkVersion === constants.CHAIN_ID &&
      web3Context.account
    );
  };

  return (
    <div>
      <header className="bg-primary shadow-xl">
        <div className="container mx-auto">
          <div className="navbar text-neutral-content">
            <div className="flex-1 px-2 mx-2">
              <Link
                to="/"
                className="btn btn-ghost btn-sm rounded-btn logo indicator"
              >
                <div className="indicator-item badge badge-primary text-xs">
                  Beta
                </div>
                <span className="text-lg font-bold normal-case">Purry</span>
              </Link>
            </div>
            <div className="px-2 mx-2">
              {showSwitchNetworkButton && (
                <button
                  onClick={switchNetwork}
                  className="btn btn-ghost btn-sm border border-white rounded-btn normal-case"
                >
                  Switch to {constants.NETWORK_NAME} Network
                </button>
              )}
              {!window.ethereum && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://metamask.io/download/"
                  className="btn btn-ghost btn-sm border border-white rounded-btn normal-case"
                >
                  <img
                    src={metamaskIcon}
                    width={25}
                    alt="MetaMask Icon"
                    className="mr-1"
                  />
                  Install MetaMask
                </a>
              )}
              {showConnectWalletButton && (
                <button
                  onClick={web3Context.activateBrowserWallet}
                  className="btn btn-ghost btn-sm border border-white rounded-btn normal-case"
                >
                  Connect Wallet
                </button>
              )}
              {showConnectWalletAddress() && (
                <p className="header-wallet">
                  {truncateAddress(web3Context.account)}
                </p>
              )}
            </div>
            <div
              className={
                showMobileMenu ? "px-2 mx-2" : "hidden lg:flex px-2 mx-2"
              }
            >
              <div className="flex items-stretch mobile-menu">
                {showProfileButton && (
                  <Link
                    to={`/user/${web3Context.account}`}
                    className="btn btn-ghost btn-sm rounded-btn normal-case"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block w-5 mr-2 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>
                )}
              </div>
            </div>
            <div className="lg:hidden">
              <button
                className="btn btn-square btn-ghost"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {web3Context.showErrorMessage && (
        <div className="alert alert-error rounded-none">
          <div className="container mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 mx-2 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <label>{web3Context.errorMessage}</label>
          </div>
        </div>
      )}
      <div className="alert alert-info rounded-none">
        <div className="container mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-6 h-6 mx-2 stroke-current w-44"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>{" "}
          </svg>
          <p>
            You can "purr" a message below with up to 85 characters (incl.
            spaces).{" "}
            <label htmlFor="info-modal" className="link link-primary">
              Click here
            </label>{" "}
            for further instructions. This is a beta version, we are working on
            improvements and all messages may get deleted as a result. Please
            try it out and feel free to leave us feedback in a message below!
          </p>
        </div>
      </div>
      <input type="checkbox" id="info-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <p>
            By sending a message, you create an NFT that shows the text of your
            message. You can only use certain characters (all letters and
            numbers, some special characters - ASCII standard). Any interaction
            (sending messages, up/downvoting, setting a username etc.) should
            open your Metamask and ask you to confirm. Once the transaction is
            confirmed, the message (we call it a "purr") is displayed here on
            purry.io. If Metamask is not prompted, you may have used too many or
            non-supported characters. You can click on any message to see
            replies. If your "purr" receives too many dislikes, it may fade
            away!
            <br />
            <br />
            If you are new to Metamask: Install the Metamask extension in your
            browser and add the Avalanche Fuji Testnet, e.g. by going to{" "}
            <a
              href="https://chainlist.org/"
              target="_blank"
              rel="noreferrer"
              className="link link-primary"
            >
              chainlist.org
            </a>
            : click "Connect Wallet", switch on the toggle "Testnets" and search
            for Fuji. Get test AVAX for free from a{" "}
            <a
              href="https://faucet.avax-test.network/"
              target="_blank"
              rel="noreferrer"
              className="link link-primary"
            >
              faucet
            </a>
            . Once you have Test AVAX you can start using Purry by clicking
            "Connect Wallet".
          </p>
          <div className="modal-action">
            <label htmlFor="info-modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
