import { useState } from "react";

import { getMemberNoFromToken } from "../../../shared/lib";
import { storyApi } from "../api";

export function useStoryViewer() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedStory, setSelectedStory] = useState(null);

	const openStoryViewer = async (targetMemberNo) => {
		try {
			const currentMemberNo = getMemberNoFromToken();
			if (!currentMemberNo) {
				alert("로그인이 필요합니다.");
				return { success: false, reason: "NO_LOGIN" };
			}

			const res = await storyApi.selectStoryListByMember(targetMemberNo);
			const stories = res.data || [];

			if (stories.length === 0) {
				alert("유효한 스토리가 없습니다.");
				return { success: false, reason: "EMPTY" };
			}

			await Promise.all(
				stories.map((story) =>
					storyApi.insertStoryVisitor(currentMemberNo, story.storyNo).catch(() => {})
				)
			);

			const storyDetails = await Promise.all(
				stories.map((story) =>
					storyApi
						.selectStoryDetail(story.storyNo)
						.then((res) => res.data)
						.catch((err) => {
							console.error("스토리 상세 로드 실패:", err);
							return null;
						})
				)
			);

			const validDetails = storyDetails.filter(Boolean);
			if (!validDetails.length) return { success: false, reason: "NO_VALID" };

			const mergedItems = validDetails
				.sort(
					(a, b) =>
						new Date(a.story.createDate || 0) -
						new Date(b.story.createDate || 0)
				)
				.map((detail) => ({
					storyNo: detail.story.storyNo,
					createDate: detail.story.createDate,
					filePath: detail.story.filePath,
					content: detail.story.content,
					type: detail.story.type,
					likes: detail.likeList || [],
					visitors: detail.visitorList || [],
					comments: detail.commentList || [],
				}));

			setSelectedStory({
				owner: {
					memberNo: stories[0].memberNo,
					memberNick: stories[0].memberNick,
					profileImg: stories[0].profileImg,
				},
				items: mergedItems,
			});
			setIsOpen(true);
			return { success: true };
		} catch (err) {
			console.error("스토리 뷰어 열기 실패:", err);
			return { success: false };
		}
	};

	const closeStoryViewer = () => {
		setIsOpen(false);
	};

	return {
		isOpen,
		selectedStory,
		openStoryViewer,
		closeStoryViewer,
		setIsOpen,
		setSelectedStory,
	};
}
