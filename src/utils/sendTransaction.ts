import constants from "../constants";
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
    console.log(error);
    notification({
      type: "warning",
      message: error.data.message,
      errorCode: error.code,
    });
    return Promise.reject(new Error(error.data.message));
  }
}
