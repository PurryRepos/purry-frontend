import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Web3Context from "../../context/Web3Context";
import decodeBase64 from "../../utils/decodeBase64";
// @ts-ignore
import Message from "../../components/Message/Message.tsx";

export default function Profile() {
  const address = useParams().address;
  const { contract, account } = useContext(Web3Context);
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (contract && account) {
      setNfts([]);
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  const init = async () => {
    await getUserMessages();
    await getUsername();
    setLoading(false);
  };

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

  const getUsername = async () => {
    // const username = await contract.getUserName(address);
    console.log(address);

    const username = await contract.getUserNameOwner(1);
    setUsername(username);
  };

  return (
    <div className="flex flex-col">
      {username}
      {loading ? (
        <p className="text-center mt-5">
          <b>Loading...</b>
        </p>
      ) : nfts.length ? (
        nfts.map((nft, key) => <Message nft={nft} key={key} />)
      ) : (
        <p className="text-center mt-5">
          <b>You don't have an NFT yet</b>
        </p>
      )}
    </div>
  );
}
