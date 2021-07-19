import DashboardView from "./pages/DashboardView";
import Add from "./pages/Add";
import NotFound from "./pages/NotFound";
import Logout from "./pages/Logout";
import NeedAuth from "./pages/NeedAuth";
import DashboardIndex from "./pages/DashboardIndex";
import Home from "./pages/Home";

export const routes = [
  { path: "/", component: Home },
  { path: "/dashboards", component: DashboardIndex },
  { path: "/logout", component: Logout },
  { path: "/dashboards/:id", component: DashboardView },
  { path: "/dashboards/:id/add", component: Add },
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
