import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Web3Context from "../../context/Web3Context";
import truncateAddress from "../../utils/truncateAddress";
import sendTransaction from "../../utils/sendTransaction";

import styles from "./Message.module.scss";

dayjs.extend(relativeTime);

const Message = ({ nft, ...props }: any) => {
  const navigate = useNavigate();
  const { contract } = useContext(Web3Context);
  const [message, setMessage] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [creationDateFromNow, setCreationDateFromNow] = useState("");
  const [author, setAuthor] = useState("");
  const [authorWallet, setAuthorWallet] = useState("");
  const [userStatus, setUserStatus] = useState(false);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const init = async () => {
    if (contract) {
      let _author, _authorWallet;
      nft.attributes.forEach((attr: { trait_type: string; value: any }) => {
        switch (attr.trait_type) {
          case "Created":
            const date = dayjs.unix(parseInt(attr.value));
            setCreationDate(date.format("HH:mm • DD MMM YYYY"));
            setCreationDateFromNow(date.fromNow());
            break;
          case "Author":
            _author = attr.value;
            break;
          case "Author Wallet":
            _authorWallet = attr.value;
            setAuthorWallet(_authorWallet);
            break;
          default:
            break;
        }
      });
      if (_authorWallet === _author) {
        setAuthor(truncateAddress(_author));
      } else {
        setAuthor(_author);
        setUserStatus(true);
      }
    }
  };

  const reply = async (e) => {
    e.preventDefault();
    sendTransaction({
      contract,
      method: "mintReply",
      argsArray: [message, nft.tokenId],
      gasPrice: true,
    });
  };

  const voteUp = async (e) => {
    e.preventDefault();
    sendTransaction({
      contract,
      method: "voteUpMessage",
      argsArray: [nft.tokenId],
      gasPrice: true,
    });
  };

  const voteDown = async (e) => {
    e.preventDefault();
    sendTransaction({
      contract,
      method: "voteDownMessage",
      argsArray: [nft.tokenId],
      gasPrice: true,
    });
  };

  const redirectToProfile = (e) => {
    e.preventDefault();
    navigate(`/user/${authorWallet}`);
  };

  return (
    <Link
      to={`/thread/${nft.tokenId}`}
      className={`mt-6 ${styles.disableUserSelect}`}
      {...props}
    >
      <div className="flex justify-center shadow-md hover:shadow-lg">
        <div className="flex flex-col w-full bg-white	rounded-lg p-5">
          <div className=" flex flex-col">
            <img
              src={nft.image}
              className={styles.disableUserSelect}
              alt="Purry NFT"
            />
            <div className="flex flex-row justify-between items-center mt-3 mb-3">
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
              <div className={styles.messageInfo}>
                Posted by:{" "}
                <span
                  title={authorWallet}
                  onClick={(e) => redirectToProfile(e)}
                  className={`hover:underline ${
                    !userStatus ? styles.unregistered : ""
                  }`}
                >
                  {author}
                </span>{" "}
                •{" "}
                <span title={creationDate} className="hover:underline">
                  {creationDateFromNow}
                </span>
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
