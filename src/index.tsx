import { render } from "react-dom";
import App from "./App";

import "./tailwind.css";
import "react-notifications-component/dist/theme.css";
import "./index.css";

const rootElement = document.getElementById("root");
render(<App />, rootElement);
