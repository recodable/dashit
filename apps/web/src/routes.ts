import Index from "./views/Index";
import Dashboard from "./views/Dashboard";
import Add from "./views/Add";
import NotFound from "./views/NotFound";

const routes = [
  { path: "/", component: Index },
  { path: "/:id", component: Dashboard },
  { path: "/:id/add", component: Add },
  { path: "*all", component: NotFound },
];

export default routes;
