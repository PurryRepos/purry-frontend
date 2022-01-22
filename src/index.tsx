import { render } from "react-dom";
// @ts-ignore
import App from "./App.tsx";

import "./tailwind.css";
import "./index.css";

const rootElement = document.getElementById("root");
render(<App />, rootElement);
