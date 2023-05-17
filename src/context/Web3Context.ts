import { createContext } from "react";

export type Web3ContextType = {
  provider: any;
  signer: any;
  account: string;
  contract: any;
  errorMessage: string;
  showErrorMessage: boolean;
  activateBrowserWallet: (provider: any) => void;
};

const defaultValue: Web3ContextType = {
  provider: null,
  signer: "",
  account: "",
  contract: null,
  errorMessage: "",
  showErrorMessage: false,
  activateBrowserWallet: (_provider: any) => {},
};

export default createContext(defaultValue);
