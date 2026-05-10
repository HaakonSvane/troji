import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import { useNavigate } from "react-router";
import type { groupsMembersQuery } from "@/__generated__/groupsMembersQuery.graphql";
import { getRelayEnvironment } from "@/relay/environment";
import { MemberRow } from "@/components/MemberRow";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import type { Route } from "./+types/groups.$id.members";

const GroupMembersPageQuery = graphql`
    query groupsMembersQuery($id: ID!) {
        groupById(id: $id) {
            id
            name
            admin {
                id
            }
            members(first: 50) {
                totalCount
                edges {
                    node {
                        id
                        ...MemberRow_user
                    }
                }
            }
        }
        me {
            id
        }
    }
`;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<groupsMembersQuery>(environment, GroupMembersPageQuery, {
        id: params.id,
    });
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
        { title: "Members — Troji" },
        { name: "description", content: "All members of this circle." },
    ];
}

export default function GroupMembers({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const data = usePreloadedQuery(GroupMembersPageQuery, loaderData.queryRef);
    const group = data.groupById;
    const myId = data.me?.id;

    if (!group) {
        return (
            <main className="container mx-auto flex flex-col items-start gap-3 px-4 py-10 sm:py-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-destructive">
                    <span aria-hidden className="mr-2">!</span>
                    not found
                </p>
                <h1 className="font-heading text-3xl tracking-[0.015em]">
                    That circle isn&apos;t here.
                </h1>
                <Button variant="outline" size="terminal" onClick={() => navigate("/groups")}>
                    <span aria-hidden>‹</span>
                    Back to circles
                </Button>
            </main>
        );
    }

    const members = group.members?.edges?.map((e) => e?.node).filter(Boolean) ?? [];
    const adminId = group.admin?.id;

    return (
        <main className="container mx-auto flex flex-col gap-6 px-4 py-10 sm:py-14">
            <Breadcrumb
                segments={[
                    { label: "groups", href: "/groups" },
                    { label: group.name, href: `/groups/${group.id}` },
                    { label: "members" },
                ]}
            />
            <div className="flex items-baseline gap-3">
                <h1 className="font-heading text-3xl font-medium tracking-[0.015em]">Members</h1>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {group.members?.totalCount ?? 0} souls
                </span>
            </div>
            <div className="surface-card flex flex-col divide-y divide-border">
                {members.map((member) => (
                    <div key={member.id} className="px-5">
                        <MemberRow
                            user={member}
                            isAdmin={member.id === adminId}
                            isSelf={member.id === myId}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}
