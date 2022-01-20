import { createContext } from "react";

const defaultValue = {
  signer: null,
  account: null,
  contract: null,
  errorMessage: "",
  showErrorMessage: false,
  activateBrowserWallet: () => {},
};

export default createContext(defaultValue);
