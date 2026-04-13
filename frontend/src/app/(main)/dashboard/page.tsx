import { loadSerializableQuery } from "@/relay/loadSerializableQuery";
import { DashboardQuery } from "./Dashboard";
import DashboardPageQueryNode, {
    DashboardPageQuery,
} from "@/__generated__/DashboardPageQuery.graphql";

const DashboardPage = async () => {
    const preloadedDashboardQuery = await loadSerializableQuery<
        typeof DashboardPageQueryNode,
        DashboardPageQuery
    >(DashboardPageQueryNode.params, {});
    return <DashboardQuery preloadedQuery={preloadedDashboardQuery} />;
};

export default DashboardPage;
