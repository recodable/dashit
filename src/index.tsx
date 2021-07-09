import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
import Worker from "./worker.js?worker";

const worker = new Worker();

render(() => <App />, document.getElementById("root"));
