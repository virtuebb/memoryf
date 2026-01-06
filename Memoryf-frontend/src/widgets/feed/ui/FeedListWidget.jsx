import "./FeedListWidget.css";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { FeedItem } from "../../../entities/feed";
import { useFeedList } from "../../../features/feed";

// 정렬 옵션 상수 (SOLID: Open/Closed Principle - 확장 가능)
const SORT_OPTIONS = {
	POPULAR: "popular",
	FOLLOWING: "following",
	RECENT: "recent",
};

function FeedListWidget({ reloadKey = 0 }) {
	const location = useLocation();
	const enabled = location.pathname === "/feeds";

	const loadMoreRef = useRef(null);
	const PAGE_SIZE = 18;

	const {
		feeds,
		loading,
		loadingMore,
		error,
		sortBy,
		setSortBy,
		hasMore,
		fetchNextPage,
		SORT_OPTIONS: HOOK_SORT_OPTIONS,
	} = useFeedList({ enabled, pageSize: PAGE_SIZE, reloadKey, initialSortBy: SORT_OPTIONS.RECENT });

	// 무한 스크롤: 하단 sentinel이 보이면 다음 페이지 로드
	useEffect(() => {
		if (!enabled) return;
		if (!hasMore) return;
		if (loading || loadingMore) return;

		const el = loadMoreRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0];
				if (first?.isIntersecting) {
					fetchNextPage();
				}
			},
			{ root: null, rootMargin: "200px", threshold: 0 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [enabled, hasMore, loading, loadingMore, fetchNextPage]);

	// 정렬 옵션 변경 핸들러
	const handleSortChange = (newSortBy) => setSortBy(newSortBy);

	if (loading) {
		return (
			<div className="feed-list-page">
				<div className="feed-list-header">
					<h1>피드</h1>
				</div>
				<div className="loading">로딩 중...</div>
			</div>
		);
	}

	if (error && feeds.length === 0) {
		return (
			<div className="feed-list-page">
				<div className="feed-list-header">
					<h1>피드</h1>
				</div>
				<div className="error">{error}</div>
			</div>
		);
	}

	return (
		<div className="feed-list-page">
			{/* 헤더 및 정렬 옵션 */}
			<div className="feed-list-header">
				<h1>피드</h1>
				<div className="feed-sort-options">
					<button
						className={`sort-btn ${sortBy === SORT_OPTIONS.POPULAR ? "active" : ""}`}
						onClick={() => handleSortChange(SORT_OPTIONS.POPULAR)}
					>
						인기순
					</button>
					<button
						className={`sort-btn ${sortBy === SORT_OPTIONS.FOLLOWING ? "active" : ""}`}
						onClick={() => handleSortChange(SORT_OPTIONS.FOLLOWING)}
					>
						팔로잉
					</button>
					<button
						className={`sort-btn ${sortBy === SORT_OPTIONS.RECENT ? "active" : ""}`}
						onClick={() => handleSortChange(SORT_OPTIONS.RECENT)}
					>
						최신순
					</button>
				</div>
			</div>

			{/* 3*N 그리드 레이아웃 (인스타그램 스타일) */}
			{feeds.length === 0 ? (
				<div className="feed-empty-state">
					<p>아직 등록된 피드가 없습니다.</p>
					<p>첫 번째 피드를 작성해보세요! 📸</p>
				</div>
			) : (
				<>
					<div className="feed-grid">
						{feeds.map((feed) => (
							<FeedItem key={feed.feedNo} feed={feed} isGrid={true} />
						))}
					</div>

					<div ref={loadMoreRef} className="feed-load-more">
						{loadingMore ? "로딩 중…" : hasMore ? "" : ""}
					</div>
				</>
			)}
		</div>
	);
}

export default FeedListWidget;
