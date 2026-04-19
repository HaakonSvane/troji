import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("sign-in/*", "routes/sign-in.tsx"),
    route("sign-up/*", "routes/sign-up.tsx"),
    layout("routes/_protected.tsx", [
        route("register", "routes/register.tsx"),
        route("dashboard", "routes/dashboard.tsx"),
    ]),
] satisfies RouteConfig;
