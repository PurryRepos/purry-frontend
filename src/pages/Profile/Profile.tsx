import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getProvider from "../../utils/getProvider";
import Web3Context from "../../context/Web3Context";
import decodeBase64 from "../../utils/decodeBase64";
import truncateAddress from "../../utils/truncateAddress";
import sendTransaction from "../../utils/sendTransaction";
import Message from "../../components/Message/Message";

import styles from "./Profile.module.scss";

export default function Profile() {
  const address = useParams().address;
  const { contract, account } = useContext(Web3Context);
  const [loading, setLoading] = useState(true);
  const [disableUsername, setDisableUsername] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [totalNfts, setTotalNfts] = useState(0);
  const [totalUpvotes, setTotalUpvotes] = useState(0);
  const [username, setUsername] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [userStatus, setUserStatus] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    if (contract && account) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  useEffect(() => {
    if (address && contract && account) {
      getUserMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const init = async () => {
    setIsMyProfile(account === address);
    getUsername();
    getUserStatus();
    getUserUpVotes();
    getUserMessages();
  };

  const getUserMessages = async () => {
    setLoading(true);
    const userMessageIds = await contract.getUserMessageIds(address);
    const _nfts = [];
    setTotalNfts(userMessageIds.length);
    for (const userMessageId of [...userMessageIds].reverse()) {
      let nft = await contract.tokenURI(userMessageId);
      nft = decodeBase64(nft.split(",")[1]);
      nft = JSON.parse(nft);
      nft.tokenId = userMessageId;
      _nfts.push(nft);
    }
    setNfts(_nfts);
    setLoading(false);
  };

  const getUsername = async () => {
    let _username = await contract.getUserName(address);
    if (_username.length === 42) {
      _username = truncateAddress(_username);
    }
    setUsername(_username);
  };

  const getUserStatus = async () => {
    const _userStatus = await contract.isRegisteredUser(address);
    setUserStatus(_userStatus);
  };

  const getUserUpVotes = async () => {
    const _totalUpvotes = await contract.getUserUpVotes(address);
    setTotalUpvotes(_totalUpvotes.toNumber());
  };

  const voteUpUser = async () => {
    if (isMyProfile) return;
    const upvoteUserTrx: any = await sendTransaction({
      contract,
      method: "voteUpUser",
      argsArray: [address],
      gasPrice: true,
    });
    const provider = await getProvider();
    if (provider) {
      const _newUserName = await provider.waitForTransaction(
        upvoteUserTrx.hash,
        1, // confirmations
        150000 // timeout
      );
      if (_newUserName.status) {
        setTotalUpvotes(totalUpvotes + 1);
        setShowMessage(true);
        setMessage("User upvoted");
        getUserMessages();
        setTimeout(() => {
          setShowMessage(false);
          setMessage("");
        }, 5000);
      }
    }
  };

  const updateUserName = async () => {
    setDisableUsername(true);
    try {
      const userNameTrx: any = await sendTransaction({
        contract,
        method: "setUserName",
        argsArray: [newUserName],
        gasPrice: true,
      });
      const provider = await getProvider();
      if (provider) {
        const _newUserName = await provider.waitForTransaction(
          userNameTrx.hash,
          1, // confirmations
          150000 // timeout
        );
        if (_newUserName.status) {
          setUsername(newUserName);
          setShowMessage(true);
          setMessage("Username updated");
          getUserMessages();
          setTimeout(() => {
            setShowMessage(false);
            setMessage("");
          }, 5000);
        }
      }
    } finally {
      setNewUserName("");
      setDisableUsername(false);
    }
  };

  const calcUserFontSize = (str) => {
    const strLength = str ? str.length : 0;
    if (strLength <= 10) {
      return 2.25;
    } else if (strLength <= 20) {
      return 1.5;
    } else {
      return 1;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mt-5 mb-5">
        <div className="stat">
          <div className="stat-title">Username</div>
          <div
            className={`stat-value text-primary ${
              !userStatus ? "opacity-70" : ""
            }`}
            style={{ fontSize: `${calcUserFontSize(username)}rem` }}
          >
            {username}
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block w-8 h-8 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div className="stat-title">Total Posts</div>
          <div className="stat-value text-primary">{totalNfts}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg
              onClick={voteUpUser}
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                !isMyProfile ? `${styles.bounce} hover:cursor-pointer` : ""
              } inline-block w-8 h-8 stroke-current`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <div className="stat-title">Total Upvotes</div>
          <div className="stat-value text-primary">{totalUpvotes}</div>
        </div>
      </div>
      {showMessage && (
        <div className="alert alert-success mb-5">
          <div className="container mx-auto">
            <div className="flex-1">
              <label>{message}</label>
            </div>
          </div>
        </div>
      )}
      {isMyProfile && (
        <div className="flex flex-row form-control">
          <input
            disabled={disableUsername}
            onClick={(e) => e.preventDefault()}
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            type="text"
            placeholder={username}
            className="input input-bordered basis-4/5 mr-3"
          />
          <button
            disabled={disableUsername}
            onClick={updateUserName}
            className="btn btn-primary leading-4"
          >
            Update Username
          </button>
        </div>
      )}
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
