import { createEffect } from "solid-js";
import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
import Worker from "./worker.js?worker";
import fetchIntercept from "fetch-intercept";
import { Router } from "solid-app-router";
import routes from "./routes";

const worker = new Worker();

fetchIntercept.register({
  response: (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response;
  },
});

render(
  () => (
    <Router routes={routes}>
      <App />
    </Router>
  ),
  document.getElementById("root")
);
