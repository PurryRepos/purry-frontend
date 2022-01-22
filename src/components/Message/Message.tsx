import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import truncateAddress from "../../utils/truncateAddress";

import "./Message.css";

dayjs.extend(relativeTime);

const Message = ({ nftStr }) => {
  const nft = JSON.parse(nftStr);
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
    console.log(attr.trait_type, attr.value);
  });
  userName = userStatus ? userName : truncateAddress(userName);

  const fromNow = dayjs.unix(creationDate).fromNow();

  return (
    <div className="message-container flex justify-center mt-6">
      <div className="message flex flex-col">
        <img src={nft.image} alt="" />
        <div className="mt-2">
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
  );
};

export default Message;
