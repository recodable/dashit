import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
// import Worker from "./worker.js?worker";
import fetchIntercept from "fetch-intercept";
import { Router } from "solid-app-router";
import routes from "./routes";
import { Auth0 } from "@rturnq/solid-auth0";

// const worker = new Worker();

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
    <Auth0
      domain={import.meta.env.VITE_AUTH0_DOMAIN} // domain from Auth0
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID} // client_id from Auth0
      // audience="..." // audience from Auth0
      logoutRedirectUri={`${window.location.origin}/logout`} // Absolute URI Auth0 logout redirect
      loginRedirectUri={`${window.location.origin}`} // Absolute URI Auth0 login
    >
      <Router routes={routes}>
        <App />
      </Router>
    </Auth0>
  ),
  document.getElementById("root")
);
