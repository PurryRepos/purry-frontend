import { createContext } from "react";

export type Web3ContextType = {
  signer: string;
  account: string;
  contract: any;
  errorMessage: string;
  showErrorMessage: boolean;
  activateBrowserWallet: () => void;
};

const defaultValue = {
  signer: "",
  account: "",
  contract: null,
  errorMessage: "",
  showErrorMessage: false,
  activateBrowserWallet: () => {},
};

export default createContext(defaultValue);
