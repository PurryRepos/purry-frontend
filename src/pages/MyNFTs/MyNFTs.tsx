import { useContext, useEffect, useState } from "react";
import Web3Context from "../../context/Web3Context";
import decodeBase64 from "../../utils/decodeBase64";
// @ts-ignore
import Message from "../../components/Message/Message.tsx";

export default function MyNFTs() {
  const { contract, account } = useContext(Web3Context);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (contract && account) {
      getUserMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  const getUserMessages = async () => {
    const userMessageIds = await contract.getUserMessageIds(account);
    setNfts([]);
    [...userMessageIds].reverse().forEach(async (userMessageId) => {
      let nft = await contract.tokenURI(userMessageId);
      nft = decodeBase64(nft.split(",")[1]);
      nft = JSON.parse(nft);
      setNfts((previousNfts) => [...previousNfts, nft]);
    });
  };

  return (
    <div className="flex flex-col">
      {nfts.length ? (
        nfts.map((nft, key) => <Message nft={nft} key={key} />)
      ) : (
        <p className="text-center mt-5">
          <b>You don't have an NFT yet</b>
        </p>
      )}
    </div>
  );
}
