import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import type { groupsPageQuery } from "@/__generated__/groupsPageQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GroupBox } from "@/components/GroupBox";
import { DrawerDialog } from "@/components/DrawerDialog";
import { JoinGroupForm } from "@/components/JoinGroupForm";
import { NewGroupForm } from "@/components/NewGroupForm";
import type { Route } from "./+types/groups";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const GroupsPageQuery = graphql`
    query groupsPageQuery {
        me {
            id
            groups(first: 24, order: { createdDate: DESC })
                @connection(key: "Groups_groups", filters: []) {
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
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <div className="size-6 animate-spin rounded-full border-2 border-medal-gold/40 border-t-medal-gold" />
                <span>loading</span>
            </div>
        </div>
    );
}

export function meta() {
    return [
        { title: "Groups — Troji" },
        { name: "description", content: "All your circles. Create one, join one, start competing." },
    ];
}

export default function Groups({ loaderData }: Route.ComponentProps) {
    const data = usePreloadedQuery(GroupsPageQuery, loaderData.queryRef);
    const edges = data.me?.groups?.edges ?? [];
    const [joinGroupOpen, setJoinGroupOpen] = useState(false);
    const [newGroupOpen, setNewGroupOpen] = useState(false);
    const groupConnections = data.me
        ? [ConnectionHandler.getConnectionID(data.me.id, "Groups_groups")]
        : [];

    return (
        <main className="container mx-auto px-4 py-10 sm:py-14">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <Breadcrumb segments={[{ label: "groups" }]} />
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <h1 className="font-heading text-4xl font-medium tracking-[0.015em] text-foreground sm:text-5xl">
                            Your circles.
                        </h1>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="terminal"
                                onClick={() => setJoinGroupOpen(true)}
                            >
                                <span aria-hidden>›</span>
                                Join with code
                            </Button>
                            <Button
                                variant="gold"
                                size="terminal"
                                onClick={() => setNewGroupOpen(true)}
                            >
                                <span aria-hidden>▸</span>
                                New circle
                            </Button>
                        </div>
                    </div>
                </div>

                {edges.length === 0 ? (
                    <div className="surface-card flex flex-col items-start gap-4 p-8 sm:p-10">
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-medal-gold">
                            <span aria-hidden className="mr-2">▸</span>
                            ledger empty
                        </p>
                        <p className="font-heading text-2xl tracking-[0.015em] text-foreground sm:text-3xl">
                            No circles yet — go assemble one.
                        </p>
                        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                            A circle is your private competition. Create one and invite your
                            people, or jump into an existing one with a code.
                        </p>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                            <Button
                                variant="gold"
                                size="terminal"
                                onClick={() => setNewGroupOpen(true)}
                            >
                                <span aria-hidden>▸</span>
                                Create circle
                            </Button>
                            <Button
                                variant="outline"
                                size="terminal"
                                onClick={() => setJoinGroupOpen(true)}
                            >
                                <span aria-hidden>›</span>
                                Join with code
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {edges.map((edge) => {
                            if (!edge?.node) return null;
                            return (
                                <Link
                                    key={edge.node.id}
                                    to={`/groups/${edge.node.id}`}
                                    className="group"
                                >
                                    <GroupBox group={edge.node} />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <DrawerDialog
                open={joinGroupOpen}
                onOpenChange={setJoinGroupOpen}
                title="Join a circle"
                description="Enter an invite code to join an existing circle."
            >
                <JoinGroupForm onJoined={() => setJoinGroupOpen(false)} />
            </DrawerDialog>
            <NewGroupForm
                open={newGroupOpen}
                onOpenChange={setNewGroupOpen}
                connections={groupConnections}
            />
        </main>
    );
}
