import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
// import Worker from "./worker.js?worker";
import fetchIntercept from "fetch-intercept";
import { Router } from "solid-app-router";
import { routes, unauthenticatedRoutes } from "./routes";
import { Auth0, useAuth0 } from "@rturnq/solid-auth0";
import { Switch, Match } from "solid-js";
import { Loading } from "./icons";
import { AuthContextProvider } from "./auth";

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
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      logoutRedirectUri={`${window.location.origin}/logout`}
      loginRedirectUri={`${window.location.origin}`}
      audience={import.meta.env.VITE_API_URL}
    >
      <AuthContextProvider>
        <Switch>
          <Match when={!useAuth0().isInitialized()}>
            <div class="w-screen h-screen bg-gray-900 flex justify-center items-center">
              <Loading class="w-10 h-10" />
            </div>
          </Match>

          <Match when={!useAuth0().isAuthenticated()}>
            <Router routes={unauthenticatedRoutes}>
              <App />
            </Router>
          </Match>

          <Match when={true}>
            <Router routes={routes}>
              <App />
            </Router>
          </Match>
        </Switch>
      </AuthContextProvider>
    </Auth0>
  ),
  document.getElementById("root")
);
