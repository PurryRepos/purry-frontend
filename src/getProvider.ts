import { ethers } from "ethers";
import constants from "./constants";

declare var window: any;

export default async function getSigner() {
  if (!window.ethereum) {
    throw new Error("metamask-not-found");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  const network = await provider.getNetwork();
  const chainId = network.chainId;
  if (!window.ethereum) {
    return false;
  }

  if (chainId.toString() !== constants.CHAIN_ID.toString()) {
    throw new Error("wrong-network");
  }

  return await provider;
}
