import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Web3Context from "../../context/Web3Context";
import decodeBase64 from "../../utils/decodeBase64";
import Message from "../../components/Message/Message";

import styles from "../../components/Message/Message.module.scss";
import sortArrayOfObjects from "../../utils/sortArrayOfObjects";

export default function Thread() {
  const tokenId = useParams().tokenId;
  const { contract } = useContext(Web3Context);
  const [nfts, setNfts] = useState([]);
  // const [threadMapping, setThreadMapping] = useState(null);

  useEffect(() => {
    if (contract && tokenId) {
      getThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, tokenId]);

  const recursiveSearch = (obj: any, results = []): number[] => {
    const r = results;
    Object.keys(obj).forEach((key: string, i: number) => {
      const value = obj[key];
      r.push(key);
      recursiveSearch(value, r);
    });
    return r;
  };

  const formatMessageIds = (threadString: string) => {
    const regex = /(.)(\d+)(.)/g;
    if (threadString.match(regex)) {
      threadString = threadString.replaceAll(regex, '$1"$2"$3');
    }
    return getMessageIds(JSON.parse(threadString));
  };

  const getMessageIds = (_threadMapping: any) => {
    // setThreadMapping(_threadMapping);
    const threadIs = recursiveSearch(_threadMapping);
    return threadIs;
  };

  const getThread = async () => {
    const threadString = await contract.getThread(tokenId);
    const messageIds = formatMessageIds(threadString);

    setNfts([]);
    const promises = [];
    for (let i = 0; i < messageIds.length; ++i) {
      promises.push(contract.tokenURI(messageIds[i]));
    }
    const messages = await Promise.all(promises);

    messages.forEach((nft, i) => {
      nft = decodeBase64(nft.split(",")[1]);
      nft = JSON.parse(nft);
      nft.tokenId = messageIds[i];
      setNfts((previousNfts) =>
        sortArrayOfObjects([...previousNfts, nft], "tokenId")
      );
    });

    const element = document.getElementById(`message-${tokenId}`);
    setTimeout(() => {
      window.scrollTo({
        behavior: element ? "smooth" : "auto",
        top: element ? element.offsetTop - 20 : 0,
      });
      element && element.classList.add(styles.active);
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
          <b>Loading...</b>
        </p>
      )}
    </div>
  );
}
