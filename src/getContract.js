import { ethers } from "ethers";
import constants from "./constants";
import NFtalkContract from "./abi/NFtalk";
import getSigner from "./getSigner";

export default async function getContract() {
  const signer = await getSigner();
  if (!signer) return false;
  return new ethers.Contract(
    constants.CONTRACT_ADDRESS,
    NFtalkContract.abi,
    signer
  );
}
