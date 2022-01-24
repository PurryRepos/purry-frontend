import { ethers } from "ethers";
import constants from "./constants";
import PurryContract from "./abi/Purry";
import getSigner from "./getSigner";

export default async function getContract() {
  const signer = await getSigner();
  if (!signer) return false;
  return new ethers.Contract(
    constants.CONTRACT_ADDRESS,
    PurryContract.abi,
    signer
  );
}
