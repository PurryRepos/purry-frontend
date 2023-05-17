import { ethers } from "ethers";
import constants from "../constants";

declare var window: any;

export default async function getProvider() {
  let provider;
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  } else {
    provider = getInfuraProvider();
  }
  const network = await provider.getNetwork();
  const chainId = network.chainId;

  if (chainId.toString() !== constants.CHAIN_ID.toString()) {
    throw new Error("wrong-network");
  }

  try {
    await provider.send("eth_requestAccounts", []);
  } catch (error) {
    provider = getInfuraProvider();
  }

  return await provider;
}

const getInfuraProvider = () => {
  const provider: any = new ethers.providers.JsonRpcProvider(
    `https://avalanche-fuji.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
  );
  // const provider: any = new ethers.providers.InfuraProvider(
  //   "rinkeby",
  //   process.env.REACT_APP_INFURA_ID
  // );
  provider.isInfura = true;
  return provider;
};
