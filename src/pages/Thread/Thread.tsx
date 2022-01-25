import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Web3Context from "../../context/Web3Context";
import decodeBase64 from "../../utils/decodeBase64";
// @ts-ignore
import Message from "../../components/Message/Message.tsx";

export default function Thread() {
  const tokenId = useParams().tokenId;
  const { contract, account } = useContext(Web3Context);
  const [nfts, setNfts] = useState([]);
  // const [threadMapping, setThreadMapping] = useState(null);

  useEffect(() => {
    if (contract && account && tokenId) {
      getThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account, tokenId]);

  const recursiveSearch = (obj, results = []) => {
    const r = results;
    Object.keys(obj).forEach((key, i) => {
      const value = obj[key];
      r.push(key);
      recursiveSearch(value, r);
    });
    return r;
  };

  const formatMessageIds = (threadString) => {
    const regex = /(.)(\d+)(.)/g;
    if (threadString.match(regex)) {
      threadString = threadString.replaceAll(regex, '$1"$2"$3');
    }
    console.log(threadString);

    return getMessageIds(JSON.parse(threadString));
  };

  const getMessageIds = (_threadMapping) => {
    // setThreadMapping(_threadMapping);
    const threadIs = recursiveSearch(_threadMapping);
    return threadIs;
  };

  const getThread = async () => {
    const threadString = await contract.getThread(tokenId);
    const messageIds = formatMessageIds(threadString);

    setNfts([]);
    messageIds.forEach(async (userMessageId, i) => {
      let nft = await contract.tokenURI(userMessageId);
      nft = decodeBase64(nft.split(",")[1]);
      nft = JSON.parse(nft);
      nft.tokenId = userMessageId;
      setNfts((previousNfts) => [...previousNfts, nft]);
    });

    setTimeout(() => {
      const element = document.getElementById(`message-${tokenId}`);
      window.scrollTo({
        behavior: element ? "smooth" : "auto",
        top: element ? element.offsetTop - 20 : 0,
      });
      element.classList.add("active");
    }, 100);
  };

  return (
    <div className="flex flex-col">
      {nfts.length ? (
        nfts.map((nft, key) => (
          <Message
            nft={nft}
            key={`message-${key}`}
            id={`message-${nft.tokenId}`}
          />
        ))
      ) : (
        <p className="text-center mt-5">
          <b>You don't have an NFT yet</b>
        </p>
      )}
    </div>
  );
}
