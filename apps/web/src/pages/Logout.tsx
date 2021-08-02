import { onMount } from "solid-js";
import { useNavigate } from "solid-app-router";

const Logout = () => {
  const navigate = useNavigate();

  onMount(() => navigate("/"));

  return null;
};

export default Logout;
