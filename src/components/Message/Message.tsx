import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Web3Context from "../../context/Web3Context";
import truncateAddress from "../../utils/truncateAddress";
import constants from "../../constants";

import "./Message.css";

dayjs.extend(relativeTime);

const Message = ({ nft }) => {
  const { contract } = useContext(Web3Context);
  const [message, setMessage] = useState("");
  let creationDate, userName, userStatus;

  nft.attributes.forEach((attr) => {
    switch (attr.trait_type) {
      case "Created":
        creationDate = attr.value;
        break;
      case "User Name":
        userName = attr.value;
        break;
      case "User Status":
        userStatus = attr.value === "Registered";
        break;
      default:
        break;
    }
  });
  const fromNow = dayjs.unix(creationDate).fromNow();
  userName = userStatus ? userName : truncateAddress(userName);

  const reply = async (e) => {
    e.preventDefault();
    contract.mintReply(message, nft.tokenId, {
      gasPrice: constants.GAS_PRICE,
      gasLimit: 9000000,
    });
  };

  const voteUp = async (e) => {
    e.preventDefault();
    contract.voteUpMessage(nft.tokenId);
  };

  const voteDown = async (e) => {
    e.preventDefault();
    contract.voteDownMessage(nft.tokenId);
  };

  return (
    <Link to={`/thread/${nft.tokenId}`}>
      <div className="flex justify-center mt-6">
        <div className="message-container flex flex-col w-full bg-white	rounded-lg p-5">
          <div className=" flex flex-col">
            <img src={nft.image} alt="" />
            <div className="flex flex-row justify-between items-center message-info mt-3 mb-3">
              <div>
                <span
                  onClick={(e) => voteUp(e)}
                  className="btn btn-sm btn-primary mr-2"
                >
                  👍
                </span>
                <span
                  onClick={(e) => voteDown(e)}
                  className="btn btn-sm btn-primary mr-2"
                >
                  👎
                </span>
              </div>
              <div>
                Created by:{" "}
                {userStatus ? (
                  userName
                ) : (
                  <span className="unregistered">{userName}</span>
                )}{" "}
                - {fromNow}
              </div>
            </div>
          </div>
          <div className="flex flex-row form-control">
            <input
              onClick={(e) => e.preventDefault()}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type your message"
              className="input input-bordered basis-4/5 mr-3"
            />
            <button onClick={reply} className="btn btn-primary basis-1/5">
              Mint
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Message;
