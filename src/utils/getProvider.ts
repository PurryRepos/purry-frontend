import { ethers } from "ethers";

declare var window: any;

export default async function getProvider() {
  let provider;
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = getInfuraProvider();
  }

  try {
    const isMetamaskUnlocked = await window.ethereum?._metamask.isUnlocked();
    if (isMetamaskUnlocked === false) {
      await provider.send("eth_requestAccounts", []);
    }
  } catch (error) {
    provider = getInfuraProvider();
    console.log(error);
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
