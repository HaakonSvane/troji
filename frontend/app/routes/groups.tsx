import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import type { groupsPageQuery } from "@/__generated__/groupsPageQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { GroupBox } from "@/components/GroupBox";
import { NewGroupForm } from "@/components/NewGroupForm";
import type { Route } from "./+types/groups";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const GroupsPageQuery = graphql`
    query groupsPageQuery {
        me {
            id
            groups(first: 24, order: { createdDate: DESC }) @connection(key: "Groups_groups") {
                edges {
                    node {
                        id
                        ...GroupBox_group
                    }
                }
            }
        }
    }
`;

export async function clientLoader(_args: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<groupsPageQuery>(environment, GroupsPageQuery, {});
    return { queryRef };
}

export function HydrateFallback() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
}

export function meta() {
    return [{ title: "Groups — Troji" }];
}

export default function Groups({ loaderData }: Route.ComponentProps) {
    const data = usePreloadedQuery(GroupsPageQuery, loaderData.queryRef);
    const edges = data.me?.groups?.edges ?? [];
    const [newGroupOpen, setNewGroupOpen] = useState(false);

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Groups</h1>
                <Button onClick={() => setNewGroupOpen(true)}>New group</Button>
            </div>
            {edges.length === 0 ? (
                <p className="text-muted-foreground">
                    You have no groups yet.{" "}
                    <span className="text-foreground font-medium">Create one to get started.</span>
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {edges.map((edge) => {
                        if (!edge?.node) return null;
                        return (
                            <Link key={edge.node.id} to={`/groups/${edge.node.id}`}>
                                <GroupBox group={edge.node} />
                            </Link>
                        );
                    })}
                </div>
            )}
            <NewGroupForm open={newGroupOpen} onOpenChange={setNewGroupOpen} connectionOwner={data.me?.id ?? ""} />
        </main>
    );
}
