import { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/ko";

import { getComments, getFeedDetail } from "../../../entities/feed";
import { getMemberNoFromToken } from "../../../shared/lib";
import { getAssetUrl } from "../../../shared/api";

import { toggleFeedBookmark } from "../bookmark-feed";
import { createComment, deleteComment, toggleCommentLike } from "../comment";
import { likeFeed } from "../like-feed";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale("ko");

dayjs.updateLocale("ko", {
	relativeTime: {
		future: "%s",
		past: "%s",
		s: "방금",
		m: "1분",
		mm: "%d분",
		h: "1시간",
		hh: "%d시간",
		d: "1일",
		dd: "%d일",
		M: "1개월",
		MM: "%d개월",
		y: "1년",
		yy: "%d년",
	},
});

export function useFeedDetail(feedNo) {
	const [feed, setFeed] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(0);
	const [isBookmarked, setIsBookmarked] = useState(false);

	const feedFiles = useMemo(() => feed?.feedFiles || [], [feed]);
	const hasMultipleImages = feedFiles.length > 1;

	const getImageUrl = (filePath) => {
		if (!filePath) return "";
		return getAssetUrl(filePath) || filePath;
	};

	const formatTimeAgo = (dateString) => {
		if (!dateString) return "";
		const parsed = dayjs(dateString);
		if (!parsed.isValid()) return "";

		const now = dayjs();
		const isDateOnly = typeof dateString === "string" && dateString.length <= 10;

		const diffMinutes = Math.max(0, now.diff(parsed, "minute"));
		const diffHours = Math.max(0, now.diff(parsed, "hour"));
		const diffDays = Math.max(0, now.diff(parsed, "day"));

		if (isDateOnly) {
			if (diffDays === 0) {
				if (diffMinutes < 1) return "방금";
				if (diffMinutes < 60) return `${diffMinutes}분`;
				if (diffHours < 24) return `${diffHours}시간`;
				return "오늘";
			}

			if (diffDays < 7) return `${diffDays}일`;
			if (diffDays === 7) return "1주";

			const dateFormat = parsed.year() === now.year() ? "MM.DD" : "YYYY.MM.DD";
			return parsed.format(dateFormat);
		}

		if (diffMinutes < 1) return "방금";
		if (diffMinutes < 60) return `${diffMinutes}분`;
		if (diffHours < 24) return `${diffHours}시간`;
		if (diffDays < 7) return `${diffDays}일`;
		if (diffDays === 7) return "1주";
		const dateFormat = parsed.year() === now.year() ? "MM.DD" : "YYYY.MM.DD";
		return parsed.format(dateFormat);
	};

	const renderTextWithTags = (text) => {
		if (!text) return null;
		const parts = text.split(/(\s+)/);
		return parts.map((part, index) => {
			if (/^\s+$/.test(part)) return part;
			if (/^#\S+/.test(part)) {
				return (
					<span key={index} className="inline-tag">
						{part}
					</span>
				);
			}
			return <span key={index}>{part}</span>;
		});
	};

	const refreshComments = async () => {
		const commentsData = await getComments(feedNo);
		setComments(Array.isArray(commentsData) ? commentsData : []);
	};

	const fetchFeed = async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getFeedDetail(feedNo);
			setFeed(data);
			setIsLiked(Boolean(data?.isLiked ?? data?.liked));
			setLikeCount(data?.likeCount || 0);
			setIsBookmarked(Boolean(data?.isBookmarked ?? data?.bookmarked));
			setCurrentImageIndex(0);

			await refreshComments();
		} catch (err) {
			console.error("피드 상세 조회 오류:", err);
			setError("피드를 불러오는데 실패했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!feedNo) return;
		void fetchFeed();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feedNo]);

	useEffect(() => {
		const handleFeedChanged = async () => {
			if (!feedNo) return;
			try {
				const data = await getFeedDetail(feedNo);
				setFeed(data);
				setIsLiked(Boolean(data?.isLiked ?? data?.liked));
				setLikeCount(data?.likeCount || 0);
				setIsBookmarked(Boolean(data?.isBookmarked ?? data?.bookmarked));
				await refreshComments();
			} catch (err) {
				console.error("피드 갱신 오류:", err);
			}
		};

		window.addEventListener("feedChanged", handleFeedChanged);
		return () => window.removeEventListener("feedChanged", handleFeedChanged);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feedNo]);

	const handlePrevImage = () => {
		if (feedFiles.length === 0) return;
		setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : feedFiles.length - 1));
	};

	const handleNextImage = () => {
		if (feedFiles.length === 0) return;
		setCurrentImageIndex((prev) => (prev < feedFiles.length - 1 ? prev + 1 : 0));
	};

	const handleSubmitComment = async (e) => {
		e.preventDefault();
		const trimmed = newComment.trim();
		if (!trimmed) return;

		const memberNo = getMemberNoFromToken();
		if (!memberNo) {
			alert("로그인이 필요합니다.");
			return;
		}

		try {
			const result = await createComment(feedNo, trimmed, memberNo);
			if (!result?.success) {
				alert(result?.message || "댓글 등록에 실패했습니다.");
				return;
			}

			await refreshComments();
			setNewComment("");
		} catch (err) {
			console.error("댓글 등록 실패:", err);
			alert("댓글 등록에 실패했습니다.");
		}
	};

	const handleToggleLike = async () => {
		const memberNo = getMemberNoFromToken();
		if (!memberNo) {
			alert("로그인이 필요합니다.");
			return;
		}

		try {
			const result = await likeFeed(feedNo, memberNo);
			if (result?.success) {
				// mergeApiResponseData로 data 필드가 최상위 레벨로 병합됨
				const isLiked = result.isLiked;
				const likeCount = result.likeCount;
				
				if (isLiked !== undefined) {
					setIsLiked(isLiked);
				}
				if (likeCount !== undefined) {
					setLikeCount(likeCount);
				} else if (isLiked !== undefined) {
					// 호환성: 백엔드가 likeCount를 반환하지 않는 경우
					setLikeCount((prev) => (isLiked ? prev + 1 : Math.max(0, prev - 1)));
				}
			}
		} catch (err) {
			console.error("좋아요 처리 실패:", err);
		}
	};

	const handleToggleBookmark = async () => {
		const memberNo = getMemberNoFromToken();
		if (!memberNo) {
			alert("로그인이 필요합니다.");
			return;
		}

		try {
			const result = await toggleFeedBookmark(feedNo, memberNo);
			if (result?.success) {
				setIsBookmarked(result.isBookmarked);
			}
		} catch (err) {
			console.error("북마크 처리 실패:", err);
		}
	};

	const handleToggleCommentLike = async (commentNo) => {
		const memberNo = getMemberNoFromToken();
		if (!memberNo) {
			alert("로그인이 필요합니다.");
			return;
		}

		try {
			const result = await toggleCommentLike(feedNo, commentNo, memberNo);
			if (!result?.success) {
				alert(result?.message || "댓글 좋아요 처리에 실패했습니다.");
				return;
			}
			await refreshComments();
		} catch (err) {
			console.error("댓글 좋아요 처리 실패:", err);
		}
	};

	const handleDeleteComment = async (commentNo) => {
		try {
			const result = await deleteComment(feedNo, commentNo);
			if (!result?.success) {
				alert(result?.message || "댓글 삭제에 실패했습니다.");
				return;
			}
			await refreshComments();
		} catch (err) {
			console.error("댓글 삭제 실패:", err);
			alert("댓글 삭제에 실패했습니다.");
		}
	};

	return {
		feed,
		feedFiles,
		hasMultipleImages,
		loading,
		error,
		currentImageIndex,
		setCurrentImageIndex,
		comments,
		newComment,
		setNewComment,
		isLiked,
		likeCount,
		isBookmarked,
		getImageUrl,
		formatTimeAgo,
		renderTextWithTags,
		refreshComments,
		handlePrevImage,
		handleNextImage,
		handleSubmitComment,
		handleToggleLike,
		handleToggleBookmark,
		handleToggleCommentLike,
		handleDeleteComment,
	};
}
