import { useAuth0 } from "@rturnq/solid-auth0";
import { onMount } from "solid-js";
import { useRouter } from "solid-app-router";

const Logout = () => {
  const [, { replace }] = useRouter();

  onMount(() => replace("/"));

  return null;
};

export default Logout;
