import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
import Worker from "./worker.js?worker";
import fetchIntercept from "fetch-intercept";

const worker = new Worker();

fetchIntercept.register({
  response: (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response;
  },
});

render(() => <App />, document.getElementById("root"));
