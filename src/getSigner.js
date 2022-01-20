import { ethers } from "ethers";
import constants from "./contants.js";

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

  if (chainId !== constants.CHAIN_ID) {
    throw new Error("wrong-network");
  }

  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}
