import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("sign-in/*", "routes/sign-in.tsx"),
    route("sign-up/*", "routes/sign-up.tsx"),
    route("feedback", "routes/feedback.ts"),
    layout("routes/_protected.tsx", [
        route("register", "routes/register.tsx"),
        route("dashboard", "routes/dashboard.tsx"),
        route("groups", "routes/groups.tsx"),
        route("groups/:id", "routes/groups.$id.tsx"),
        route("groups/:id/games/:gameId", "routes/groups.$id.games.$gameId.tsx"),
        route("groups/:id/members", "routes/groups.$id.members.tsx"),
        route("groups/:id/activities", "routes/groups.$id.activities.tsx"),
        route("groups/:id/games", "routes/groups.$id.games.tsx"),
    ]),
] satisfies RouteConfig;
