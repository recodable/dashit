import { createEffect } from "solid-js";
import { useRouter } from "solid-app-router";
import { useAuth0 } from "@rturnq/solid-auth0";

const Home = () => {
  const [, { replace }] = useRouter();
  const { isAuthenticated } = useAuth0();

  createEffect(() => {
    if (!isAuthenticated()) return;
    replace("/dashboards");
  });

  return <h1>Home</h1>;
};

export default Home;
