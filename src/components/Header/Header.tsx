import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Web3Context from "../../context/Web3Context";

import "./Header.css";

export default function Header() {
  const web3Context = useContext(Web3Context);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const truncate = (str) => {
    return str.slice(0, 5) + "..." + str.slice(-5);
  };

  return (
    <>
      {web3Context.showErrorMessage && (
        <div className="mt-5 alert alert-error pl-6">
          <div className="flex-1">
            <label>{web3Context.errorMessage}</label>
          </div>
        </div>
      )}
      <div className="navbar mt-5 mb-2 shadow-lg text-neutral-content rounded-box bg-primary">
        <div className="flex-1 px-2 mx-2">
          <Link to="/" className="btn btn-ghost btn-sm rounded-btn">
            <span className="text-lg font-bold">NFTweets</span>
          </Link>
        </div>
        <div
          className={showMobileMenu ? "px-2 mx-2" : "hidden lg:flex px-2 mx-2"}
        >
          <div className="flex items-stretch mobile-menu">
            <Link to="/" className="btn btn-ghost btn-sm rounded-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              Likes
            </Link>
            <Link to="/mynfts" className="btn btn-ghost btn-sm rounded-btn">
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              MyNFTs
            </Link>
            <Link to="/" className="btn btn-ghost btn-sm rounded-btn">
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
          </div>
        </div>
        <div className="px-2 mx-2">
          {!web3Context.account ? (
            <button
              onClick={() => web3Context.activateBrowserWallet()}
              className="btn btn-ghost btn-sm rounded-btn"
            >
              Connect Wallet
            </button>
          ) : (
            <p className="header-wallet">{truncate(web3Context.account)}</p>
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
    </>
  );
}
