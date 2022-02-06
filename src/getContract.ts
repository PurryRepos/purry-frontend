import { ethers } from "ethers";
import constants from "./constants";
import PurryContract from "./abi/Purry.json";
import getSigner from "./getSigner";

// TODO: TypeChain integration

export default async function getContract() {
  const signer = await getSigner();
  if (!signer) return false;
  return new ethers.Contract(
    constants.CONTRACT_ADDRESS,
    PurryContract.abi,
    signer
  );
}
