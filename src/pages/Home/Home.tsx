import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Web3Context from "../../context/Web3Context";
import decodeBase64 from "../../utils/decodeBase64";
import constants from "../../constants";
// @ts-ignore
import Message from "../../components/Message/Message.tsx";

export default function Home() {
  const { contract } = useContext(Web3Context);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState("");
  const [nfts, setNfts] = useState([]);
  const [page, setPage] = useState(1);
  const [latestMessageId, setLatestMessageId] = useState(null);
  const limit = 5;

  useEffect(() => {
    if (contract) {
      setNfts([]);
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (latestMessageId && latestMessageId > 0) {
        const latestIds = range(latestMessageId - limit, latestMessageId);
        for await (let i of latestIds) {
          let nft = await contract.tokenURI(i);
          nft = decodeBase64(nft.split(",")[1]);
          nft = JSON.parse(nft);
          nft.tokenId = i;
          setNfts((previousNfts) => [...previousNfts, nft]);
        }
      }
      if (
        latestMessageId === 0 ||
        (latestMessageId && latestMessageId <= limit)
      ) {
        setHasMore(false);
      }
    };
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestMessageId]);

  const mint = async () => {
    contract.mint(message, {
      gasPrice: constants.GAS_PRICE,
    });
  };

  const range = (start, end) => {
    let output = [];
    for (let i = start + 1; i < end + 1; i++) {
      output.push(i);
    }
    return output.reverse().filter((i) => i > 0);
  };

  const init = async () => {
    const _latestMessageId = await getLatestMessageId();
    setLatestMessageId(_latestMessageId.toNumber());
  };

  const getLatestMessageId = async () => {
    return await contract.getLatestMessageId();
  };

  const getLatestMessages = () => {
    if (latestMessageId > 0) {
      setLatestMessageId(latestMessageId - limit);
      setPage(page + 1);
    }
  };

  return (
    <>
      <div className="flex flex-row form-control mt-6">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type your message"
          className="input shadow-md basis-4/5 mr-3"
        />
        <button onClick={mint} className="btn btn-primary shadow-lg basis-1/5">
          Send
        </button>
      </div>
      <InfiniteScroll
        dataLength={limit * page} //This is important field to render the next data
        next={getLatestMessages}
        hasMore={hasMore}
        loader={
          <p className="text-center">
            <b>Loading...</b>
          </p>
        }
        endMessage={
          <p className="text-center">
            {/* <b>Yay! You have seen it all</b> */}
          </p>
        }
      >
        <div className="flex flex-col">
          {nfts.map((nft, key) => (
            <Message nft={nft} key={key} />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}
