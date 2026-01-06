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

			// 아이템 병합 및 정렬
			const mergedItems = validDetails
				.sort(
					(a, b) =>
						new Date(a.story.createdAt || a.story.createDate || 0) -
						new Date(b.story.createdAt || b.story.createDate || 0)
				)
				.flatMap((detail) =>
					(detail.items || []).map((item) => ({
						...item,
						// 필드명 정규화: savedName → changeName (호환성)
						changeName: item.savedName || item.changeName,
						savedName: item.savedName || item.changeName,
						createDate: item.createdAt || item.createDate,
						createdAt: item.createdAt || item.createDate,
						isDel: item.isDeleted || item.isDel,
						isDeleted: item.isDeleted || item.isDel,
						_storyNo: detail.story.storyNo,
						_storyCreateDate: detail.story.createdAt || detail.story.createDate,
					}))
				);

			setSelectedStory({
				owner: {
					memberNo: stories[0].memberNo,
					memberNick: stories[0].memberNick,
					// 프로필 이미지 필드명 정규화
					profileImg: stories[0].profileImg || stories[0].profileSavedName || stories[0].profileChangeName,
					profileSavedName: stories[0].profileImg || stories[0].profileSavedName || stories[0].profileChangeName,
					profileChangeName: stories[0].profileImg || stories[0].profileSavedName || stories[0].profileChangeName,
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
