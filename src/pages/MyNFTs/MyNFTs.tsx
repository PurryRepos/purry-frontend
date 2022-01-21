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
      let nft = await contract.tokenURI(userMessageId);
      nft = decodeBase64(nft.split(",")[1]);
      setNfts((previousNfts) => [...previousNfts, nft]);
    });
  };

  const decodeBase64 = function(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
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
