import { useContext, useEffect, useState } from "react";
import Web3Context from "../../context/Web3Context";
import decodeBase64 from "../../utils/decodeBase64";
// @ts-ignore
import Message from "../../components/Message/Message.tsx";

export default function Thread() {
  const { contract, account } = useContext(Web3Context);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (contract && account) {
      getThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  const getThread = async () => {
    const thread = await contract.getThread();
    console.log(thread);

    const messageIds = getMessageIds(thread);

    setNfts([]);
    [...messageIds].reverse().forEach(async (userMessageId) => {
      let nft = await contract.tokenURI(userMessageId);
      nft = decodeBase64(nft.split(",")[1]);
      nft = JSON.parse(nft);
      setNfts((previousNfts) => [...previousNfts, nft]);
    });
  };

  const getMessageIds = (thread) => {
    // get
    return [];
  };

  return (
    <div className="flex flex-col">
      {nfts.length ? (
        nfts.map((nftStr, key) => <Message nftStr={nftStr} key={key} />)
      ) : (
        <p className="text-center mt-5">
          <b>You don't have an NFT yet</b>
        </p>
      )}
    </div>
  );
}
