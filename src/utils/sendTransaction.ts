import constants from "../constants";
import { isRinkebyNetwork, isFujiNetwork, isLocalNetwork } from "./getNetwork";
import notification from "../components/notification";

type TransactionType = {
  contract: any;
  method: string;
  argsArray: any[];
  gasPrice: boolean;
};

export default async function sendTransaction({
  contract,
  method,
  argsArray,
  gasPrice,
}: TransactionType) {
  try {
    let args = argsArray;
    if (gasPrice) {
      args.push({
        gasPrice: constants.GAS_PRICE,
      });
    }
    return await contract[method].apply(this, args);
  } catch (error) {
    let message, errorCode;
    if (isRinkebyNetwork() && error.error) {
      message = error.error.message;
      errorCode = error.error.code;
    } else if ((isLocalNetwork() || isFujiNetwork()) && error.data) {
      message = error.data.message;
      errorCode = error.data.code;
    } else {
      message = error.message;
      if (error.message.startsWith("sending a transaction requires a signer")) {
        message = "Please install MetaMask to interact with application";
      }
      errorCode = error.code;
    }

    notification({
      type: "warning",
      message,
      errorCode,
    });

    return Promise.reject(new Error(error));
  }
}
