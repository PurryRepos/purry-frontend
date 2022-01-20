import { useContext, useEffect, useState } from "react";
import Web3Context from "../../context/Web3Context";
import constants from "../../contants";

export default function MyNFTs() {
  const { contract, account } = useContext(Web3Context);
  const [message, setMessage] = useState("");
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (contract && account) {
      getUserMessageId();
    }
  }, [contract, account]);

  const getUserMessageId = async () => {
    const userMessageIds = await contract.getUserMessageIds(account);
    console.log(userMessageIds);

    setNfts([]);
    userMessageIds.forEach(async (userMessageId) => {
      const nft = await contract.tokenURI(userMessageId);
      setNfts((previousNfts) => [...previousNfts, nft]);
    });
  };

  const NftComponent = ({ nftStr }) => {
    const nft = JSON.parse(nftStr);
    let creationDate = nft.attributes.find(
      (attr) => attr.trait_type === "Created"
    );
    return (
      <div className="flex justify-center mt-5">
        <div className="flex mr-5 pt-5">{creationDate.value}</div>

        <img src={nft.image} alt="" />
      </div>
    );
  };

  return (
    <div className="flex form-control">
      {nfts.map((nftStr, key) => (
        <NftComponent nftStr={nftStr} key={key} />
      ))}
    </div>
  );
}
