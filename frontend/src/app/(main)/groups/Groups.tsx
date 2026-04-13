"use client";

import { PageDescription, PageHeader, PageTitle } from "@/components/labels/PageHeader";
import { graphql, usePreloadedQuery } from "react-relay";
import { MyGroups } from "./components/MyGroups";
import { getCurrentEnvironment } from "@/relay/environment";
import { useSerializablePreloadedQuery } from "@/relay/useSerializablePreloadedQuery";
import { SerializablePreloadedQuery } from "@/relay/loadSerializableQuery";
import GroupsPageQueryNode, { type GroupsPageQuery } from "@/__generated__/GroupsPageQuery.graphql";
import { Input } from "@/components/ui/input";
import {
    DrawerDialog,
    DrawerDialogBody,
    DrawerDialogContent,
    DrawerDialogDescription,
    DrawerDialogHeader,
    DrawerDialogTitle,
    DrawerDialogTrigger,
} from "@/components/ui/drawerDialog";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import { NewGroupForm } from "./components/NewGroupForm";
import { useState } from "react";
import { toast } from "sonner";

const GroupsPageQuery = graphql`
    query GroupsPageQuery {
        me {
            groups(order: [{ createdDate: DESC }], first: 12)
                @connection(key: "GroupsFragment_groups") {
                __id
                edges {
                    node {
                        id
                    }
                }
            }
            ...MyGroupsFragment
        }
    }
`;

type GroupsQueryProps = {
    preloadedQuery: SerializablePreloadedQuery<typeof GroupsPageQueryNode, GroupsPageQuery>;
};

export const GroupsQuery = ({ preloadedQuery }: GroupsQueryProps) => {
    const environment = getCurrentEnvironment();
    const queryRef = useSerializablePreloadedQuery(environment, preloadedQuery);
    const data = usePreloadedQuery(GroupsPageQuery, queryRef);
    const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState<boolean>(false);

    const onCreateNewGroupSuccess = () => {
        setIsCreateGroupDialogOpen(false);
        toast.success("Successfulyl created a new group!");
    };
    return (
        <div className="flex flex-col gap-6">
            <PageHeader>
                <PageTitle>Groups</PageTitle>
                <PageDescription>All your groups, joined or created</PageDescription>
            </PageHeader>
            <div className="flex flex-row gap-4">
                <Input placeholder="Search for a group..." />
                <DrawerDialog
                    open={isCreateGroupDialogOpen}
                    onOpenChange={setIsCreateGroupDialogOpen}
                >
                    <DrawerDialogTrigger asChild>
                        <Button
                            variant="secondary"
                            leadingIcon={UserPlus2}
                            className="whitespace-nowrap"
                        >
                            Create group
                        </Button>
                    </DrawerDialogTrigger>
                    <DrawerDialogContent>
                        <DrawerDialogHeader>
                            <DrawerDialogTitle>Create a new group</DrawerDialogTitle>
                            <DrawerDialogDescription>
                                You can create new groups and invite all your friends to join and
                                compete.
                            </DrawerDialogDescription>
                        </DrawerDialogHeader>
                        <DrawerDialogBody>
                            <NewGroupForm
                                connectionId={data.me.groups!.__id}
                                onSuccess={onCreateNewGroupSuccess}
                            />
                        </DrawerDialogBody>
                    </DrawerDialogContent>
                </DrawerDialog>
            </div>
            <MyGroups fragmentKey={data.me} />
        </div>
    );
};
