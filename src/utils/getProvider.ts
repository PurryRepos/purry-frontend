import { ethers } from "ethers";
import constants from "../constants";

declare var window: any;

export default async function getProvider() {
  let provider;
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  } else {
    provider = new ethers.providers.InfuraProvider(
      "rinkeby",
      process.env.REACT_APP_INFURA_ID
    );
  }
  const network = await provider.getNetwork();
  const chainId = network.chainId;

  if (chainId.toString() !== constants.CHAIN_ID.toString()) {
    throw new Error("wrong-network");
  }

  return await provider;
}
