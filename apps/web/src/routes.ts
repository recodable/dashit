import Index from "./views/DashboardIndex";
import DashboardView from "./views/DashboardView";
import Add from "./views/Add";
import NotFound from "./views/NotFound";
import Logout from "./views/Logout";
import NeedAuth from "./views/NeedAuth";
import DashboardIndex from "./views/DashboardIndex";
import Home from "./views/Home";

export const routes = [
  { path: "/", component: Home },
  { path: "/dashboards", component: DashboardIndex },
  { path: "/logout", component: Logout },
  { path: "/:id", component: DashboardView },
  { path: "/:id/add", component: Add },
  { path: "/404", component: NotFound },
  { path: "*all", component: NotFound },
];

export const publicRoutes = ["/", "/:id", "/logout", "/404", "*all"];

export const unauthenticatedRoutes = routes.map((route) => {
  if (publicRoutes.includes(route.path)) return route;

  return {
    ...route,
    component: NeedAuth,
  };
});
