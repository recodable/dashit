import { lazy } from "solid-js";

export const routes = [
  { path: "/", component: lazy(() => import("./pages/Home")) },
  {
    path: "/dashboards",
    component: lazy(() => import("./pages/DashboardIndex")),
  },
  { path: "/logout", component: lazy(() => import("./pages/Logout")) },
  {
    path: "/dashboards/:id",
    component: lazy(() => import("./pages/DashboardView")),
  },
  { path: "/dashboards/:id/add", component: lazy(() => import("./pages/Add")) },
  { path: "/404", component: lazy(() => import("./pages/NotFound")) },
  { path: "*all", component: lazy(() => import("./pages/NotFound")) },
];

export const publicRoutes = ["/", "/dashboards/:id", "/logout", "/404", "*all"];

export const unauthenticatedRoutes = routes.map((route) => {
  if (publicRoutes.includes(route.path)) return route;

  return {
    ...route,
    component: lazy(() => import("./pages/NeedAuth")),
  };
});
