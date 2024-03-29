import constants from "../constants";
import { CHAIN_IDS } from "../utils/getNetwork";

interface ErrorCodes {
  readonly rpc: {
    readonly invalidInput: -32000;
    readonly resourceNotFound: -32001;
    readonly resourceUnavailable: -32002;
    readonly transactionRejected: -32003;
    readonly methodNotSupported: -32004;
    readonly limitExceeded: -32005;
    readonly parse: -32700;
    readonly invalidRequest: -32600;
    readonly methodNotFound: -32601;
    readonly invalidParams: -32602;
    readonly internal: -32603;
  };
  readonly provider: {
    readonly userRejectedRequest: 4001;
    readonly unauthorized: 4100;
    readonly unsupportedMethod: 4200;
    readonly disconnected: 4900;
    readonly chainDisconnected: 4901;
  };
}

type internalErrorMessagesType = {
  [key: string]: string | React.ReactNode | React.FunctionComponent;
};

const errorMessages: internalErrorMessagesType = {
  "Message too long": "Message too long (maximum 85 characters)",
  "Only ASCII characters":
    'Illegal character! Only ASCII (standard latin and special) characters allowed, minus the symbols " & < \\',
  "Only printable characters":
    'Illegal character! Only ASCII (standard latin and special) characters allowed, minus the symbols " & < \\',
  "Illegal character":
    'Illegal character! Only ASCII (standard latin and special) characters allowed, minus the symbols " & < \\',
  "Invalid reply Id": "Invalid message id",
  "Invalid ID": "Invalid message id",
  "Cannot vote for yourself": "Cannot vote for yourself!",
  "Name taken": "Username already taken!",
  "Too long": "Username too long (maximum 32 characters)",
  Unregistered:
    "Please register to vote! To register go to the profile page and set a username",
};

const internalErrorMessages: internalErrorMessagesType = {};

const INTERNAL_ERROR_PREFIX = {
  [CHAIN_IDS.rinkeby]: (message) => `execution reverted: ${message}`,
  [CHAIN_IDS.fuji]: (message) => `execution reverted: ${message}`,
  [CHAIN_IDS.localhost]: (message) =>
    `Error: VM Exception while processing transaction: reverted with reason string '${message}'`,
};

Object.keys(errorMessages).forEach(async (message) => {
  internalErrorMessages[INTERNAL_ERROR_PREFIX[constants.CHAIN_ID](message)] =
    errorMessages[message];
});

export { internalErrorMessages };

export const errorCodes: ErrorCodes = {
  rpc: {
    invalidInput: -32000,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    limitExceeded: -32005,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603,
  },
  provider: {
    userRejectedRequest: 4001,
    unauthorized: 4100,
    unsupportedMethod: 4200,
    disconnected: 4900,
    chainDisconnected: 4901,
  },
};

export const errorValues = {
  "-32700": {
    standard: "JSON RPC 2.0",
    message:
      "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.",
  },
  "-32600": {
    standard: "JSON RPC 2.0",
    message: "The JSON sent is not a valid Request object.",
  },
  "-32601": {
    standard: "JSON RPC 2.0",
    message: "The method does not exist / is not available.",
  },
  "-32602": {
    standard: "JSON RPC 2.0",
    message: "Invalid method parameter(s).",
  },
  "-32603": {
    standard: "JSON RPC 2.0",
    message: "Internal JSON-RPC error.",
  },
  "-32000": {
    standard: "EIP-1474",
    message: "Invalid input.",
  },
  "-32001": {
    standard: "EIP-1474",
    message: "Resource not found.",
  },
  "-32002": {
    standard: "EIP-1474",
    message: "Resource unavailable.",
  },
  "-32003": {
    standard: "EIP-1474",
    message: "Transaction rejected.",
  },
  "-32004": {
    standard: "EIP-1474",
    message: "Method not supported.",
  },
  "-32005": {
    standard: "EIP-1474",
    message: "Request limit exceeded.",
  },
  "4001": {
    standard: "EIP-1193",
    message: "User rejected the request.",
  },
  "4100": {
    standard: "EIP-1193",
    message:
      "The requested account and/or method has not been authorized by the user.",
  },
  "4200": {
    standard: "EIP-1193",
    message: "The requested method is not supported by this Ethereum provider.",
  },
  "4900": {
    standard: "EIP-1193",
    message: "The provider is disconnected from all chains.",
  },
  "4901": {
    standard: "EIP-1193",
    message: "The provider is disconnected from the specified chain.",
  },
};
