import Dashboard from "./views/Dashboard";
import Add from "./views/Add";
import NotFound from "./views/NotFound";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/add", component: Add },
  { path: "*all", component: NotFound },
];

export default routes;
