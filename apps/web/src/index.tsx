import { createEffect } from "solid-js";
import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
import Worker from "./worker.js?worker";
import fetchIntercept from "fetch-intercept";
import { Router } from "solid-app-router";
import routes from "./routes";

const worker = new Worker();

class FetchError extends Error {
  constructor(public readonly status: number, public readonly message: string) {
    super(message);
  }
}

fetchIntercept.register({
  response: (response) => {
    if (!response.ok) {
      throw new FetchError(response.status, response.statusText);
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
