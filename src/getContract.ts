import { ethers } from "ethers";
import constants from "./constants";
import PurryContract from "./abi/Purry.json";
import getSigner from "./getSigner";

// TODO: TypeChain integration

export default async function getContract(provider) {
  let signer;
  if (provider.isInfura) {
    signer = provider;
  } else {
    signer = await getSigner(provider);
  }
  if (!signer) return false;
  return new ethers.Contract(
    constants.CONTRACT_ADDRESS,
    PurryContract.abi,
    signer
  );
}
