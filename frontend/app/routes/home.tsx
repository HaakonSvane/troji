import { getAuth } from "@clerk/react-router/server";
import { redirect } from "react-router";
import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export async function loader(args: Route.LoaderArgs) {
    const { isAuthenticated } = await getAuth(args);
    if (isAuthenticated) {
        throw redirect("/dashboard");
    }
    return null;
}

export function meta({}: Route.MetaArgs) {
    return [{ title: "troji" }, { name: "description", content: "Track wins with your group." }];
}

export default function Home() {
    return <Welcome />;
}
