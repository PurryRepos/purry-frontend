import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Web3Context from "../../context/Web3Context";
import truncateAddress from "../../utils/truncateAddress";

import "./Header.css";

export default function Header() {
  const web3Context = useContext(Web3Context);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div>
      <header className="bg-primary shadow-xl">
        <div className="container mx-auto">
          <div className="navbar text-neutral-content">
            <div className="flex-1 px-2 mx-2">
              <Link to="/" className="btn btn-ghost btn-sm rounded-btn logo">
                <span className="text-lg font-bold normal-case">Purry</span>
              </Link>
            </div>
            <div
              className={
                showMobileMenu ? "px-2 mx-2" : "hidden lg:flex px-2 mx-2"
              }
            >
              <div className="flex items-stretch mobile-menu">
                {web3Context.account && (
                  <Link
                    to={`/user/${web3Context.account}`}
                    className="btn btn-ghost btn-sm rounded-btn"
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
            <div className="px-2 mx-2">
              {!web3Context.account ? (
                <button
                  onClick={web3Context.activateBrowserWallet}
                  className="btn btn-ghost btn-sm rounded-btn"
                >
                  Connect Wallet
                </button>
              ) : (
                <p className="header-wallet">
                  {truncateAddress(web3Context.account)}
                </p>
              )}
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
            <div className="flex-1">
              <label>{web3Context.errorMessage}</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
