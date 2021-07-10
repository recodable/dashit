import { createEffect } from "solid-js";
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

export const createDebug = (value) => {
  createEffect(() => console.log(value));
};

render(() => <App />, document.getElementById("root"));
