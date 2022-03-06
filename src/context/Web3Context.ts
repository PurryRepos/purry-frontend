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

const defaultValue = {
  provider: null,
  signer: "",
  account: "",
  contract: null,
  errorMessage: "",
  showErrorMessage: false,
  activateBrowserWallet: (_provider: any) => {},
};

export default createContext(defaultValue);
