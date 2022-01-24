import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getProvider from "../../getProvider";
import Web3Context from "../../context/Web3Context";
import decodeBase64 from "../../utils/decodeBase64";
import constants from "../../constants";
// @ts-ignore
import Message from "../../components/Message/Message.tsx";

export default function Profile() {
  const address = useParams().address;
  const { contract, account } = useContext(Web3Context);
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [username, setUsername] = useState("");
  const [showUsernamUpdatedMessage, setShowUsernamUpdatedMessage] =
    useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [userStatus, setUserStatus] = useState(false);

  useEffect(() => {
    if (contract && account) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  const init = async () => {
    await getUserMessages();
    await getUsername();
    await getUserStatus();
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
    const _username = await contract.getUserName(address);
    setUsername(_username);
  };

  const getUserStatus = async () => {
    const _userStatus = await contract.isRegisteredUser(address);
    setUserStatus(_userStatus);
  };

  const updateUserName = async () => {
    const userNameToSend = newUserName;
    const userNameTrx = await contract.setUserName(newUserName, {
      gasPrice: constants.GAS_PRICE,
      gasLimit: 9000000,
    });
    const provider = await getProvider();
    if (provider) {
      const _newUserName = await provider.waitForTransaction(
        userNameTrx.hash,
        1, // confirmations
        150000 // timeout
      );
      if (_newUserName.status) {
        setUsername(userNameToSend);
        setShowUsernamUpdatedMessage(true);
        getUserMessages();
        setTimeout(() => {
          setShowUsernamUpdatedMessage(false);
        }, 3000);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mt-5 mb-5">
        <div>Username: {username}</div>
      </div>
      {userStatus}
      <div className="flex flex-row form-control">
        <input
          onClick={(e) => e.preventDefault()}
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          type="text"
          placeholder={username}
          className="input input-bordered basis-4/5 mr-3"
        />
        <button onClick={updateUserName} className="btn btn-primary basis-1/5">
          Update Username
        </button>
      </div>
      {showUsernamUpdatedMessage && (
        <div className="alert alert-success mt-5">
          <div className="container mx-auto">
            <div className="flex-1">
              <label>Username updated</label>
            </div>
          </div>
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
