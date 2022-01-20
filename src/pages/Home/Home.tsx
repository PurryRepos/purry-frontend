import { useContext, useEffect, useState } from "react";
import Web3Context from "../../context/Web3Context";
import constants from "../../contants";

export default function Home() {
  const { contract } = useContext(Web3Context);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // console.log(contract);
  }, []);

  const mint = async () => {
    const res = await contract.mint(message, {
      gasPrice: constants.GAS_PRICE,
      gasLimit: 9000000,
    });
    console.log(res);
  };

  return (
    <div className="flex flex-row form-control">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type your message"
        className="input input-bordered mb-3 basis-4/5 mr-3"
      />
      <button onClick={mint} className="btn btn-primary basis-1/5">
        Mint
      </button>
    </div>
  );
}
