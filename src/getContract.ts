import { ethers } from "ethers";
import constants from "./constants";
import PurryContract from "./abi/Purry.json";
import getSigner from "./getSigner";
import getProvider from "./utils/getProvider";

// TODO: TypeChain integration

declare var window: any;

export default async function getContract() {
  let signer;
  if (window.ethereum) {
    signer = await getSigner();
  } else {
    signer = await getProvider();
  }
  if (!signer) return false;
  return new ethers.Contract(
    constants.CONTRACT_ADDRESS,
    PurryContract.abi,
    signer
  );
}
