import GroupQueryNode, { GroupPageQuery } from "@/__generated__/GroupPageQuery.graphql";
import { loadSerializableQuery } from "@/relay/loadSerializableQuery";
import { GroupQuery } from "./Group";

const GroupPage = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const decodedId = decodeURIComponent(params.id);
    const preloadedGroupQuery = await loadSerializableQuery<typeof GroupQueryNode, GroupPageQuery>(
        GroupQueryNode.params,
        { groupId: decodedId },
    );
    return <GroupQuery preloadedQuery={preloadedGroupQuery} />;
};

export default GroupPage;
