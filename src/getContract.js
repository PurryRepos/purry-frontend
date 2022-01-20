import { ethers } from "ethers";
import constants from "./contants.js";
import NFTweetContract from "./abi/NFTweet.json";
import getSigner from "./getSigner.js";

export default async function getContract() {
  const signer = await getSigner();
  if (!signer) return false;
  return new ethers.Contract(
    constants.CONTRACT_ADDRESS,
    NFTweetContract.abi,
    signer
  );
}
