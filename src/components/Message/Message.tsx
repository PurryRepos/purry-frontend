import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Web3Context from "../../context/Web3Context";
import truncateAddress from "../../utils/truncateAddress";
import constants from "../../constants";

import "./Message.css";

dayjs.extend(relativeTime);

const Message = ({ nft, ...props }: any) => {
  const navigate = useNavigate();
  const { contract } = useContext(Web3Context);
  const [message, setMessage] = useState("");
  const [userStatus, setUserStatus] = useState(false);
  let creationDate: string, author: string, authorWallet: string;

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const init = async () => {
    if (contract) {
      const getUserStatus = async (address: string) => {
        const _userStatus = await contract.isRegisteredUser(address);
        setUserStatus(_userStatus);
      };

      nft.attributes.forEach((attr: { trait_type: string; value: string }) => {
        switch (attr.trait_type) {
          case "Created":
            creationDate = attr.value;
            break;
          case "Author":
            author = attr.value;
            break;
          case "Author Wallet":
            authorWallet = attr.value;
            getUserStatus(authorWallet);
            break;
          default:
            break;
        }
      });
    }
  };

  const fromNow = dayjs.unix(parseInt(creationDate)).fromNow();
  if (!userStatus) {
    author = truncateAddress(author);
  }

  const reply = async (e) => {
    e.preventDefault();
    contract.mintReply(message, nft.tokenId, {
      gasPrice: constants.GAS_PRICE,
    });
  };

  const voteUp = async (e) => {
    e.preventDefault();
    contract.voteUpMessage(nft.tokenId, {
      gasPrice: constants.GAS_PRICE,
    });
  };

  const voteDown = async (e) => {
    e.preventDefault();
    contract.voteDownMessage(nft.tokenId);
  };

  const redirectToProfile = (e) => {
    e.preventDefault();
    navigate(`/user/${authorWallet}`);
  };

  return (
    <Link to={`/thread/${nft.tokenId}`} className=" mt-6" {...props}>
      <div className="flex justify-center shadow-md hover:shadow-lg">
        <div className="flex flex-col w-full bg-white	rounded-lg p-5">
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
                Posted by:{" "}
                <span
                  onClick={(e) => redirectToProfile(e)}
                  className={`hover:underline ${
                    !userStatus ? "unregistered" : ""
                  }`}
                >
                  {author}
                </span>{" "}
                • {fromNow}
              </div>
            </div>
          </div>
          <div className="flex flex-row form-control">
            <input
              onClick={(e) => e.preventDefault()}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type reply"
              className="input input-bordered basis-4/5 mr-3"
            />
            <button onClick={reply} className="btn btn-primary basis-1/5">
              Reply
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Message;
