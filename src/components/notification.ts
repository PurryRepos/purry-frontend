import { Store } from "react-notifications-component";
// @ts-ignore
import { errorValues, internalErrorMessages } from "../utils/errorConstants";

type NotificationType = {
  title?: string;
  message: string;
  type: "success" | "danger" | "info" | "default" | "warning";
  errorCode?: number;
  duration?: number;
};

export default function notification({
  title,
  message,
  type,
  errorCode,
  duration = 5000,
}: NotificationType) {
  let messageContent: string | React.ReactNode | React.FunctionComponent;
  if (errorCode && errorValues[errorCode]) {
    if (errorCode === -32603 && internalErrorMessages[message]) {
      messageContent = internalErrorMessages[message];
    } else {
      message = errorValues[errorCode].message;
    }
    if (!message) {
      message = "Something unexpected happened...";
    }
  }

  Store.addNotification({
    title,
    message: messageContent || message,
    type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration,
      onScreen: true,
    },
  });
}
