import { FeedListWidget } from "../../widgets/feed";

function FeedListPage({ reloadKey = 0 }) {
	return <FeedListWidget reloadKey={reloadKey} />;
}

export default FeedListPage;
