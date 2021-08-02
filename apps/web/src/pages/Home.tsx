import { createEffect } from "solid-js";
import { useNavigate } from "solid-app-router";
import { useAuth0 } from "@rturnq/solid-auth0";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  createEffect(() => {
    if (!isAuthenticated()) return;
    navigate("/dashboards", { replace: true });
  });

  return <h1>Home</h1>;
};

export default Home;
