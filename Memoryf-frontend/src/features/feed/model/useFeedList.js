import { useCallback, useEffect, useMemo, useState } from 'react';

import { getFeedList } from '../../../entities/feed';
import { getBaseURL } from '../../../shared/api';

export const FEED_SORT_OPTIONS = {
	POPULAR: 'popular',
	FOLLOWING: 'following',
	RECENT: 'recent',
};

export function useFeedList({
	enabled = true,
	pageSize = 18,
	initialSortBy = FEED_SORT_OPTIONS.RECENT,
	reloadKey = 0,
} = {}) {
	const [feeds, setFeeds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState(null);
	const [sortBy, setSortBy] = useState(initialSortBy);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const serverOrigin = useMemo(() => {
		try {
			return new URL(getBaseURL()).origin;
		} catch {
			return getBaseURL();
		}
	}, []);

	const fetchFeeds = useCallback(
		async ({ nextPage, append }) => {
			if (!enabled) return;
			try {
				setError(null);
				if (append) {
					setLoadingMore(true);
				} else {
					setLoading(true);
				}

				const data = await getFeedList(sortBy, nextPage, pageSize);
				const list = Array.isArray(data) ? data : [];
				setFeeds((prev) => (append ? [...prev, ...list] : list));
				setPage(nextPage);
				setHasMore(list.length === pageSize);
			} catch (err) {
				console.error('피드 조회 오류:', err);
				if (err.code === 'ERR_NETWORK') {
					setError(
						`백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요. (${serverOrigin})`
					);
				} else {
					setError('피드를 불러오는데 실패했습니다.');
				}
				if (!append) {
					setFeeds([]);
				}
			} finally {
				setLoading(false);
				setLoadingMore(false);
			}
		},
		[enabled, pageSize, serverOrigin, sortBy]
	);

	const refresh = useCallback(async () => {
		setFeeds([]);
		setPage(0);
		setHasMore(true);
		await fetchFeeds({ nextPage: 0, append: false });
	}, [fetchFeeds]);

	const fetchNextPage = useCallback(async () => {
		if (!enabled) return;
		if (!hasMore) return;
		if (loading || loadingMore) return;
		await fetchFeeds({ nextPage: page + 1, append: true });
	}, [enabled, fetchFeeds, hasMore, loading, loadingMore, page]);

	useEffect(() => {
		if (!enabled) return;
		refresh();
	}, [enabled, reloadKey, sortBy, refresh]);

	useEffect(() => {
		if (!enabled) return;
		const handleFeedChanged = () => {
			refresh();
		};
		window.addEventListener('feedChanged', handleFeedChanged);
		return () => window.removeEventListener('feedChanged', handleFeedChanged);
	}, [enabled, refresh]);

	return {
		feeds,
		loading,
		loadingMore,
		error,
		sortBy,
		setSortBy,
		page,
		hasMore,
		refresh,
		fetchNextPage,
		SORT_OPTIONS: FEED_SORT_OPTIONS,
	};
}
