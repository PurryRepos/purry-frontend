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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 mx-2 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
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
            className="w-6 h-6 mx-2 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>{" "}
          </svg>
          This is a Beta version, your message history may get reset.
        </div>
      </div>
    </div>
  );
}
