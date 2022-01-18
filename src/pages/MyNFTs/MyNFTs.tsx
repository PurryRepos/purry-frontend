import { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFTweetAbi from "../../abi/NFTweet.json";
import { useEthers } from "@usedapp/core";

export default function MyNFTs() {
  const { activateBrowserWallet, library } = useEthers();
  const [provider, setProvider] = useState(null);
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  useEffect(() => {
    if (library && library.provider) {
      setProvider(library.provider);
      console.log(library.provider);
    }
  }, []);

  useEffect(() => {
    if (provider) {
      console.log({ provider });
      getSigner(provider);
    }
  }, [provider]);

  const getSigner = async (provider) => {
    console.log(provider);

    const signer = await provider.getSigner();
    console.log(signer);
    // const contract = new ethers.Contract(
    //   contractAddress,
    //   NFTweetAbi.abi,
    //   signer
    // );

    // getContract(contract);
  };

  const getContract = async (c) => {
    const contract = await c.mint("asd");
    console.log(contract);
  };

  // console.log(contract);

  return <div>MyNFTs</div>;
}
