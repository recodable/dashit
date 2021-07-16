import Index from "./views/Index";
import DashboardView from "./views/DashboardView";
import Add from "./views/Add";
import NotFound from "./views/NotFound";
import Logout from "./views/Logout";

const routes = [
  { path: "/", component: Index },
  { path: "/logout", component: Logout },
  { path: "/:id", component: DashboardView },
  { path: "/:id/add", component: Add },
  { path: "/404", component: NotFound },
  { path: "*all", component: NotFound },
];

export default routes;
